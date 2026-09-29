import { env } from "../config/env";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  /**
   * Sends transactional email using Resend API or logs to console in development mode.
   */
  static async sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
    const isConfigured =
      env.RESEND_API_KEY &&
      !env.RESEND_API_KEY.includes("placeholder") &&
      env.RESEND_API_KEY.startsWith("re_");

    if (!isConfigured) {
      console.log(`\n📧 [DEV EMAIL SERVICE] -----------------------------`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`From: ${env.EMAIL_FROM}`);
      console.log(`Status: Simulated delivery (Configure RESEND_API_KEY for live delivery)`);
      console.log(`-----------------------------------------------------\n`);
      return true;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to,
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend email failed:", errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Email delivery exception:", error);
      return false;
    }
  }

  static async sendOrderConfirmation(order: {
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    totalAmount: number;
    itemsCount: number;
  }) {
    const html = `
      <div style="font-family: serif; color: #0f1b33; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ece6dc;">
        <h1 style="color: #0f1b33; margin-bottom: 4px;">INDIGO & THREAD</h1>
        <p style="font-size: 12px; color: #b3543b; text-transform: uppercase; font-family: sans-serif; letter-spacing: 1px;">Handloom • Pure Cotton • India</p>
        <hr style="border: none; border-top: 1px solid #ece6dc; margin: 20px 0;" />
        <h2 style="font-family: sans-serif; font-size: 18px;">Order Confirmed: ${order.orderNumber}</h2>
        <p style="font-size: 14px; line-height: 1.6;">Namaste ${order.customerName},</p>
        <p style="font-size: 14px; line-height: 1.6;">Thank you for supporting traditional Indian handloom craft. Your order of <strong>${order.itemsCount} piece(s)</strong> totaling <strong>₹${order.totalAmount}</strong> has been received and forwarded to our artisan cluster in Tamil Nadu & Bengal.</p>
        <div style="background-color: #faf8f5; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: sans-serif; font-size: 12px;">
          <p style="margin: 0 0 5px 0;"><strong>Order Reference:</strong> ${order.orderNumber}</p>
          <p style="margin: 0 0 5px 0;"><strong>Status:</strong> Processing & Quality Inspection</p>
          <p style="margin: 0;"><strong>Dispatch Timeline:</strong> Ships within 24-48 hours via Bluedart / Delhivery</p>
        </div>
        <p style="font-size: 12px; color: #666; font-family: sans-serif;">GSTIN: 33AAAAA0000A1Z5 | Inclusive of applicable 5% and 12% Indian Apparel GST slabs.</p>
      </div>
    `;

    return this.sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmed: ${order.orderNumber} - Indigo & Thread`,
      html,
    });
  }

  static async sendDispatchNotification(order: {
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    trackingNumber: string;
    courierPartner: string;
  }) {
    const html = `
      <div style="font-family: serif; color: #0f1b33; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ece6dc;">
        <h1 style="color: #0f1b33; margin-bottom: 4px;">INDIGO & THREAD</h1>
        <hr style="border: none; border-top: 1px solid #ece6dc; margin: 20px 0;" />
        <h2 style="font-family: sans-serif; font-size: 18px; color: #1e477a;">Your Handloom Package Has Shipped!</h2>
        <p style="font-size: 14px; line-height: 1.6;">Namaste ${order.customerName},</p>
        <p style="font-size: 14px; line-height: 1.6;">Your package for order <strong>${order.orderNumber}</strong> has been steam-pressed, carefully packaged with zero plastic, and handed over to our courier partner.</p>
        <div style="background-color: #faf8f5; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: sans-serif; font-size: 13px;">
          <p style="margin: 0 0 8px 0;"><strong>Courier Partner:</strong> ${order.courierPartner}</p>
          <p style="margin: 0;"><strong>AWB / Tracking Number:</strong> <span style="font-family: monospace; font-size: 14px; color: #b3543b;">${order.trackingNumber}</span></p>
        </div>
        <p style="font-size: 13px; font-family: sans-serif;">Estimated arrival at your doorstep: 3-5 business days.</p>
      </div>
    `;

    return this.sendEmail({
      to: order.customerEmail,
      subject: `Your Handloom Order ${order.orderNumber} Has Shipped! (${order.courierPartner})`,
      html,
    });
  }
}
