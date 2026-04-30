// app/api/analyze-palm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Resend } from 'resend';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, email, whatsapp, tier } = await request.json();

    if (!imageUrl || !email) {
      return NextResponse.json({ error: "Image and email are required" }, { status: 400 });
    }

    const tierName = {
      free: "Free Overview",
      standard: "Detailed Report",
      premium: "Premium Report",
      subscription: "Monthly Membership"
    }[tier] || "Detailed Report";

    const prompt = `You are a warm, experienced, and highly respected female Hast Rekha Expert from North India with 25+ years of experience. You speak in a caring, wise, and empowering tone like a trusted elder sister or guru.

Analyze the uploaded right palm photo carefully and write a natural, respectful, and insightful reading.

Use natural Hindi mixed with English terms (like real North Indian palmists do).

**Structure the response:**

1. **कुल हथेली की ऊर्जा** (Overall Palm Energy) - Start positive and personal.
2. **जीवन रेखा (Life Line)** - Health, vitality, major life events. 
   - If the Life Line looks strong or has recovery signs, mention: "आपकी जीवन रेखा में एक मजबूत resilience दिख रही है। कई लोग ऐसे समय से गुजरते हैं जैसे आपने near-drowning या बड़ी चुनौती का सामना किया हो, लेकिन आपने मौत को हराया और और मजबूत होकर वापस आए। यह बहुत कम लोगों में देखने को मिलता है।"
3. **मस्तिष्क रेखा (Head Line)** - Mind, career, decision making.
4. **हृदय रेखा (Heart Line)** - Love, relationships, emotions, marriage.
5. **भाग्य रेखा (Fate Line)** - Career, destiny, external influences.

For Premium tier and Subscription:
- Add specific **Gemstone / Ring suggestion** if any weakness or dosha is seen.
- Give clear **Marriage / Love life predictions**.

Make the language encouraging, genuine, and personalized. End with practical, uplifting advice for love, career, or life decisions.

Write approximately 350-500 words. Keep it warm and hopeful.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { type: "text", text: `Tier: ${tierName}. Please analyze this palm photo in detail for a young woman from North India:` },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1100,
    });

    const analysis = completion.choices[0]?.message?.content || "Unable to generate report at this time.";

    // Send Email
    await resend.emails.send({
      from: 'HastRekha Expert <reports@hastrekhaexpert.com>',
      to: email,
      subject: `✨ आपकी हस्त रेखा रिपोर्ट - ${tierName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48;">नमस्ते,</h2>
          <p>आपकी हस्त रेखा रिपोर्ट तैयार है।</p>
          <div style="background:#fffaf0; padding:25px; border-radius:12px; line-height:1.7;">
            ${analysis.replace(/\n/g, '<br><br>')}
          </div>
          <p style="margin-top:20px;">धन्यवाद,<br><strong>HastRekha Expert</strong></p>
          <p style="color:#666; font-size:12px;">यह रिपोर्ट केवल मनोरंजन और मार्गदर्शन के उद्देश्य से दी गई है।</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Report generated and sent",
      tier: tier
    });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to generate report" 
    }, { status: 500 });
  }
}