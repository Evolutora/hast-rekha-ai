import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory store (use Vercel KV / Supabase for production scale)
// For Vercel, export this or use KV — see note below
export const orders: Record<string, any> = {};

function generateOrderId() {
  return "HR" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, plan, price, image, txnId } = body;

  const orderId = generateOrderId();
  const createdAt = new Date().toISOString();

  // Store order (for production: use Vercel KV or Supabase)
  orders[orderId] = { orderId, name, email, phone, plan, price, image, txnId, status: "pending", createdAt };

  // ✅ Notify you (owner) by email
  try {
    await resend.emails.send({
      from: "HastRekha <noreply@merihastrekha.in>",  // ← must be your verified domain
      to: ["abhisheks529@gmail.com"],                 // ← your email
      subject: `🆕 New Order: ${orderId} — ₹${price} — ${name}`,
      html: `
        <h2>New HastRekha Order</h2>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone/WhatsApp:</b> ${phone}</p>
        <p><b>Plan:</b> ${plan} (₹${price})</p>
        <p><b>Transaction ID:</b> ${txnId || "Free"}</p>
        <p><b>Time:</b> ${createdAt}</p>
        <hr/>
        <p>✅ Approve करने के लिए Admin Panel खोलें:</p>
        <a href="https://www.merihastrekha.in/admin?secret=${process.env.ADMIN_SECRET}">
          Admin Panel खोलें
        </a>
        <p>Palm Image नीचे है:</p>
        <img src="${image}" style="max-width:300px; border-radius:12px;" />
      `,
    });
  } catch (e) {
    console.error("Owner email failed:", e);
  }

  return NextResponse.json({ orderId, status: "pending" });
}