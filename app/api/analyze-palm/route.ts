// Version 2.0 - Forced Build Update
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Resend } from 'resend';

// Initialize clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

// Define allowed tiers to prevent type errors
type TierType = 'free' | 'standard' | 'premium' | 'subscription';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, email, tier = 'standard' } = body as {
      imageUrl: string;
      email: string;
      whatsapp?: string;
      tier: TierType;
    };

    if (!imageUrl || !email) {
      return NextResponse.json({ error: "Image and email are required" }, { status: 400 });
    }

    // Mapping tiers to names safely
    const tierMap: Record<TierType, string> = {
      free: "Free Overview",
      standard: "Detailed Report",
      premium: "Premium Report",
      subscription: "Monthly Membership"
    };

    const tierName = tierMap[tier] || "Detailed Report";

    const prompt = `You are a warm, experienced female Hast Rekha Expert from North India. 
    Speak in natural Hindi mixed with English (Hinglish).
    Analyze the uploaded right palm photo and give a caring, detailed reading.

    Structure:
    1. कुल हथेली की ऊर्जा (Overall Energy)
    2. जीवन रेखा (Life Line)
    3. मस्तिष्क रेखा (Head Line)
    4. हृदय रेखा (Heart Line)
    5. भाग्य रेखा (Fate Line)

    ${(tier === 'premium' || tier === 'subscription') ? 'Add gemstone suggestion and marriage predictions.' : ''}

    Keep tone encouraging and personal. Use bullet points for readability.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { type: "text", text: `User Tier: ${tierName}. Please analyze this palm photo accordingly.` },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1500,
    });

    const analysis = completion.choices[0]?.message?.content || "Analysis unavailable.";

    // Send Email via Resend
    try {
      await resend.emails.send({
        from: 'HastRekha Expert <onboarding@resend.dev>', // Replace with your verified domain in production
        to: email,
        subject: `✨ आपकी हस्त रेखा रिपोर्ट - ${tierName}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>नमस्ते,</h2>
            <p>आपकी हस्त रेखा रिपोर्ट (<b>${tierName}</b>) तैयार है:</p>
            <div style="background:#fffaf0; padding:25px; border-radius:12px; border: 1px solid #ffe4b5;">
              ${analysis.replace(/\n/g, '<br>')}
            </div>
            <p style="margin-top: 20px;">धन्यवाद,<br><b>HastRekha AI Expert Team</b></p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend Email Error:", emailError);
      // We don't return error here so the user still sees their result on screen
    }

    return NextResponse.json({ 
      success: true, 
      analysis: analysis,
      tier: tierName 
    });

  } catch (error: any) {
    console.error("Global API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Something went wrong" 
    }, { status: 500 });
  }
}