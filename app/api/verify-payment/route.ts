import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { orders } from "../create-order/route";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { orderId, secret } = await req.json();

  // Admin auth check
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = orders[orderId];
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Generate report via OpenAI
  const analysisRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analyze-palm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: order.image, plan: order.plan, name: order.name }),
  });
  const { report } = await analysisRes.json();

  // Send report to customer
  await resend.emails.send({
    from: "HastRekha Expert <noreply@merihastrekha.in>", // verified domain
    to: [order.email],
    subject: `🔮 आपकी HastRekha Report आ गई — ${order.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <div style="text-align:center; background: linear-gradient(135deg, #9f1239, #be185d); color:white; padding:20px; border-radius:12px;">
          <h1 style="margin:0;">✋ HastRekha Expert</h1>
          <p style="margin:5px 0; opacity:0.8;">हस्त रेखा विशेषज्ञ • उत्तर भारत</p>
        </div>
        <div style="padding: 24px 0;">
          <p style="font-size:16px;">नमस्ते <strong>${order.name}</strong> जी,</p>
          <p>आपकी हस्त रेखा रिपोर्ट तैयार है। नीचे पढ़ें:</p>
          <hr style="border:1px solid #fce7f3; margin: 16px 0;"/>
          <div style="background:#fff5f7; padding:20px; border-radius:10px; white-space:pre-line; line-height:1.7;">
            ${report?.replace(/\n/g, "<br/>").replace(/##\s(.+)/g, "<h3 style='color:#9f1239'>$1</h3>")}
          </div>
          <hr style="border:1px solid #fce7f3; margin: 16px 0;"/>
          <p style="font-size:13px; color:#888;">यह रिपोर्ट मनोरंजन के लिए है। HastRekha Expert © 2026</p>
        </div>
      </div>
    `,
  });

  // Update order status
  orders[orderId].status = "completed";
  orders[orderId].report = report;

  return NextResponse.json({ success: true, report, whatsapp: order.phone });
}