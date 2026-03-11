// Email service using Resend
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderNumber: string;
  totalAmount: number;
}) {
  // TODO: implement email sending with Resend
  console.log('Sending order confirmation email to', params.to);
}

export async function sendShippingEmail(params: {
  to: string;
  orderNumber: string;
  trackingCode: string;
}) {
  // TODO: implement email sending with Resend
  console.log('Sending shipping email to', params.to);
}
