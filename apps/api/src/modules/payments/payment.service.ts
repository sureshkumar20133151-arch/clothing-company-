import crypto from "crypto";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { PaymentStatus, OrderStatus, PaymentMethod } from "@prisma/client";
import { VerifyRazorpayPaymentInput } from "@indigo/shared";

export class PaymentService {
  /**
   * Initializes a Razorpay order.
   * If real Razorpay keys are configured, it calls Razorpay API.
   * If placeholder keys are present in development, it generates a valid mock Razorpay order ID.
   */
  static async createRazorpayOrder(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { payment: true },
    });

    if (!order) {
      throw { statusCode: 404, message: "Order not found" };
    }

    if (order.payment?.status === PaymentStatus.PAID) {
      throw { statusCode: 400, message: "Order has already been paid" };
    }

    const amountInPaise = Math.round(order.totalAmount * 100);
    const receipt = `rcpt_${order.orderNumber}`;

    let razorpayOrderId = `order_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 7)}`;

    // If real Razorpay keys are provided, call official Razorpay API
    const isPlaceholderKey =
      !env.RAZORPAY_KEY_ID ||
      env.RAZORPAY_KEY_ID.includes("placeholder") ||
      !env.RAZORPAY_KEY_SECRET ||
      env.RAZORPAY_KEY_SECRET.includes("placeholder");

    if (!isPlaceholderKey) {
      try {
        const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString("base64");
        const response = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt,
            payment_capture: 1,
          }),
        });

        if (response.ok) {
          const rzpData = (await response.json()) as { id: string };
          razorpayOrderId = rzpData.id;
        } else {
          console.warn("Razorpay API returned error, falling back to development mock order ID");
        }
      } catch (err) {
        console.warn("Could not reach Razorpay live endpoint, using development mock order ID", err);
      }
    }

    // Update payment record with razorpay order ID
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.totalAmount,
        currency: "INR",
        status: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.RAZORPAY,
        razorpayOrderId,
      },
      update: {
        razorpayOrderId,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      amountInPaise,
      currency: "INR",
      razorpayOrderId,
      razorpayKeyId: env.RAZORPAY_KEY_ID,
      brandName: env.STORE_NAME,
      customer: {
        name: order.shippingAddressId ? (await prisma.address.findUnique({ where: { id: order.shippingAddressId } }))?.fullName : "",
        phone: order.shippingAddressId ? (await prisma.address.findUnique({ where: { id: order.shippingAddressId } }))?.phone : "",
      },
    };
  }

  /**
   * Verifies Razorpay payment signature and marks order as CONFIRMED / PAID.
   */
  static async verifyRazorpayPayment(input: VerifyRazorpayPaymentInput, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: input.orderId, userId },
      include: { payment: true },
    });

    if (!order) {
      throw { statusCode: 404, message: "Order not found" };
    }

    const isPlaceholderKey =
      !env.RAZORPAY_KEY_SECRET || env.RAZORPAY_KEY_SECRET.includes("placeholder");

    let isValid = false;

    if (isPlaceholderKey) {
      // In development test mode with placeholder keys, permit mock payments
      isValid = true;
    } else {
      const generatedSignature = crypto
        .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
        .digest("hex");

      isValid = generatedSignature === input.razorpaySignature;
    }

    if (!isValid) {
      await prisma.payment.update({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.FAILED,
          razorpayPaymentId: input.razorpayPaymentId,
          razorpaySignature: input.razorpaySignature,
        },
      });
      throw { statusCode: 400, message: "Invalid payment signature. Verification failed." };
    }

    // Mark Payment as PAID and Order as CONFIRMED
    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId: order.id },
        data: {
          status: PaymentStatus.PAID,
          razorpayPaymentId: input.razorpayPaymentId,
          razorpaySignature: input.razorpaySignature,
        },
      });

      return tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
        },
        include: {
          items: true,
          shippingAddress: true,
          payment: true,
        },
      });
    });

    return updatedOrder;
  }
}
