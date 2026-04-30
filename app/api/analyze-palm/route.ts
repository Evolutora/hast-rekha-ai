// app/api/analyze-palm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Resend } from 'resend';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, email, whatsapp, tier = 'standard' } = await request.json();

    if (!imageUrl || !email) {
      return NextResponse.json({ error: "Image and email are required" }, { status: 400 });
    }

    // Simple tier name
    let tierName = "Detailed Report";
    if (tier === 'free') tierName = "Free Overview";
    if (tier === 'premium') tierName = "Premium Report";
    if (tier === 'subscription') tierName = "Monthly Membership";

    const prompt = `You are a warm, experienced female Hast Rekha Expert from North India. Speak in natural Hindi mixed with English.

Analyze the uploaded right palm photo and give a caring, detailed reading.

Structure:
1. कुल हथेली की ऊर्जा
2. जीवन रेखा (Life Line)
3. मस्तिष्क रेखा (Head Line)
4. हृदय रेखा (Heart Line)
5. भाग्य रेखा (Fate Line)

For Premium and Subscription: Add gemstone suggestion and marriage predictions.

Keep tone encouraging and personal.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { type: "text", text: `Tier: ${tierName}. Analyze this palm photo:` },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1000,
    });

    const analysis = completion.choices[0]?.message?.content || "Unable to generate analysis at this time.";

    // Send Email
    try {
      await resend.emails.send({
        from: 'HastRekha Expert <onboarding@resend.dev>',
        to: email,
        subject: `✨ आपकी हस्त रेखा रिपोर्ट - ${tierName}`,
        html: `
          <h2>नमस्ते,</h2>
          <p>आपकी हस्त रेखा रिपोर्ट तैयार है।</p>
          <div style="background:#fffaf0; padding:25px; border-radius:12px;">
            ${analysis.replace(/\n/g, '<br><br>')}
          </div>
          <p>धन्यवाद,<br>HastRekha Expert</p>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}