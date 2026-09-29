import { prisma } from "../../config/prisma";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderFilterQuery,
  UserRole,
  calculateOrderTotals,
  calculateItemGST,
} from "@indigo/shared";
import { EmailService } from "../../services/email.service";

export class OrderService {
  static async createOrder(userId: string, input: CreateOrderInput) {
    // 1. Fetch user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw { statusCode: 400, message: "Your cart is empty" };
    }

    // 2. Resolve Shipping Address
    let shippingAddressId = input.shippingAddressId;
    if (!shippingAddressId && input.newShippingAddress) {
      const createdAddr = await prisma.address.create({
        data: {
          userId,
          ...input.newShippingAddress,
        },
      });
      shippingAddressId = createdAddr.id;
    }

    const shippingAddress = await prisma.address.findUnique({
      where: { id: shippingAddressId },
    });

    if (!shippingAddress) {
      throw { statusCode: 400, message: "Valid shipping address required" };
    }

    // 3. Resolve Billing Address
    let billingAddressId = shippingAddressId;
    if (!input.billingAddressSameAsShipping) {
      if (input.billingAddressId) {
        billingAddressId = input.billingAddressId;
      } else if (input.newBillingAddress) {
        const createdBillAddr = await prisma.address.create({
          data: {
            userId,
            ...input.newBillingAddress,
          },
        });
        billingAddressId = createdBillAddr.id;
      }
    }

    // 4. Validate stock for all items
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw {
          statusCode: 400,
          message: `Insufficient stock for ${item.variant.product.name} (${item.variant.size}). Available: ${item.variant.stock}`,
        };
      }
    }

    // 5. Calculate GST and Totals
    const calculationItems = cart.items.map((i) => ({
      unitPrice: i.variant.price,
      quantity: i.quantity,
    }));

    // Free shipping on orders over ₹1500, else ₹100 flat delivery across India
    const subtotal = calculationItems.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
    const shippingFee = subtotal >= 1500 ? 0 : 100;

    let discountAmount = 0;
    if (input.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && new Date() <= coupon.endDate && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }

        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const totals = calculateOrderTotals({
      items: calculationItems,
      shippingState: shippingAddress.state,
      shippingFee,
      discountAmount,
    });

    // 6. Generate unique Indian Order Number (e.g. IND-2026-928123)
    const orderNumber = `IND-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 7. Atomic transaction: create order, decrement stock, clear cart
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.CONFIRMED,
          paymentMethod: input.paymentMethod as PaymentMethod,
          paymentStatus:
            input.paymentMethod === PaymentMethod.COD ? PaymentStatus.PENDING : PaymentStatus.PENDING,
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          taxableAmount: totals.taxableAmount,
          cgst: totals.cgst,
          sgst: totals.sgst,
          igst: totals.igst,
          totalGst: totals.totalGst,
          shippingFee: totals.shippingFee,
          totalAmount: totals.totalAmount,
          shippingAddressId: shippingAddressId!,
          billingAddressId: billingAddressId!,
          customerNotes: input.customerNotes,
          items: {
            create: cart.items.map((item) => {
              const itemGst = calculateItemGST({
                unitPrice: item.variant.price,
                quantity: item.quantity,
                destinationState: shippingAddress.state,
                inclusiveOfTax: true,
              });

              return {
                productVariantId: item.productVariantId,
                productName: item.variant.product.name,
                variantInfo: `Size: ${item.variant.size}, Color: ${item.variant.colorName}`,
                sku: item.variant.sku,
                price: item.variant.price,
                quantity: item.quantity,
                gstRate: itemGst.gstRate,
                gstAmount: itemGst.totalGstAmount,
                total: Number((item.variant.price * item.quantity).toFixed(2)),
              };
            }),
          },
          payment: {
            create: {
              amount: totals.totalAmount,
              currency: "INR",
              status: PaymentStatus.PENDING,
              paymentMethod: input.paymentMethod as PaymentMethod,
            },
          },
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
          payment: true,
        },
      });

      // Deduct inventory
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // Empty user's cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  static async listOrders(
    userId: string,
    role: UserRole,
    query: OrderFilterQuery
  ) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Customer can only view their own orders
    if (role === "customer") {
      where.userId = userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: "insensitive" } },
        { user: { name: { contains: query.search, mode: "insensitive" } } },
        { user: { email: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          shippingAddress: true,
          payment: true,
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getOrderById(orderId: string, userId: string, role: UserRole) {
    const where: any = { id: orderId };
    if (role === "customer") {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      throw { statusCode: 404, message: "Order not found" };
    }

    return order;
  }

  static async updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw { statusCode: 404, message: "Order not found" };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: input.status as OrderStatus,
        ...(input.trackingNumber !== undefined ? { trackingNumber: input.trackingNumber } : {}),
        ...(input.courierPartner !== undefined ? { courierPartner: input.courierPartner } : {}),
      },
      include: {
        items: true,
        shippingAddress: true,
        payment: true,
        user: { select: { email: true, name: true } },
      },
    });

    if (input.status === "SHIPPED" && input.trackingNumber && updatedOrder.user) {
      EmailService.sendDispatchNotification({
        orderNumber: updatedOrder.orderNumber,
        customerEmail: updatedOrder.user.email,
        customerName: updatedOrder.user.name,
        trackingNumber: input.trackingNumber,
        courierPartner: input.courierPartner || "Bluedart Express",
      }).catch((e) => console.error("Email send error:", e));
    }

    return updatedOrder;
  }
}
