import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderEmailRequest {
  to: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
}

const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OrderEmailRequest = await req.json();
    console.log("Sending order confirmation email to:", data.to);

    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <span style="color: #666;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `).join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Order Confirmed!</h1>
            <p style="color: #666; margin: 10px 0 0;">Thank you for your order, ${data.customerName}!</p>
          </div>
          
          <div style="background: #f5f5f5; border-radius: 6px; padding: 15px; margin-bottom: 25px; text-align: center;">
            <p style="margin: 0; color: #666;">Order Number</p>
            <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; font-family: monospace; color: #333;">${data.orderNumber}</p>
          </div>

          <h2 style="font-size: 16px; color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">Order Summary</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            ${itemsHtml}
          </table>

          <table style="width: 100%; margin-bottom: 25px;">
            <tr>
              <td style="padding: 5px 0; color: #666;">Subtotal</td>
              <td style="padding: 5px 0; text-align: right;">${formatPrice(data.subtotal)}</td>
            </tr>
            ${data.discount > 0 ? `
            <tr>
              <td style="padding: 5px 0; color: #22c55e;">Discount</td>
              <td style="padding: 5px 0; text-align: right; color: #22c55e;">-${formatPrice(data.discount)}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 5px 0; color: #666;">Shipping</td>
              <td style="padding: 5px 0; text-align: right;">${data.shipping === 0 ? "FREE" : formatPrice(data.shipping)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #333;">Total</td>
              <td style="padding: 10px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #333; text-align: right;">${formatPrice(data.total)}</td>
            </tr>
          </table>

          <h2 style="font-size: 16px; color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">Shipping Address</h2>
          <p style="color: #666; line-height: 1.6;">
            ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
            ${data.shippingAddress.address}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.pinCode}<br>
            ${data.shippingAddress.country}
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0 0 10px;">Questions about your order?</p>
            <p style="color: #666; margin: 0;">Reply to this email or contact our support team.</p>
          </div>
        </div>
        
        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
          This email was sent to ${data.to}
        </p>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Orders <onboarding@resend.dev>",
      to: [data.to],
      subject: `Order Confirmed - ${data.orderNumber}`,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
