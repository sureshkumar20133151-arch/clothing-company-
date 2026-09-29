import { prisma } from "../../config/prisma";
import { AddToCartInput, UpdateCartItemInput } from "@indigo/shared";

export class CartService {
  static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { where: { isPrimary: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    const subtotal = cart.items.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
    const totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items,
      subtotal: Number(subtotal.toFixed(2)),
      totalQuantity,
    };
  }

  static async addItem(userId: string, input: AddToCartInput) {
    const cart = await this.getOrCreateCart(userId);

    // Verify variant and stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: input.productVariantId },
    });

    if (!variant) {
      throw { statusCode: 404, message: "Product variant not found" };
    }

    if (variant.stock < input.quantity) {
      throw { statusCode: 400, message: `Only ${variant.stock} units available in stock` };
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId: input.productVariantId,
        },
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + input.quantity;
      if (newQty > variant.stock) {
        throw { statusCode: 400, message: `Cannot add more than ${variant.stock} units in stock` };
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId: input.productVariantId,
          quantity: input.quantity,
        },
      });
    }

    return this.getOrCreateCart(userId);
  }

  static async updateItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const cart = await this.getOrCreateCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { variant: true },
    });

    if (!item) {
      throw { statusCode: 404, message: "Cart item not found" };
    }

    if (input.quantity === 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      if (input.quantity > item.variant.stock) {
        throw { statusCode: 400, message: `Only ${item.variant.stock} units available in stock` };
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: input.quantity },
      });
    }

    return this.getOrCreateCart(userId);
  }

  static async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });
    return this.getOrCreateCart(userId);
  }

  static async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return this.getOrCreateCart(userId);
  }
}
