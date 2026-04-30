import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Resend } from 'resend';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, email, tier = 'standard' } = body;

    if (!imageUrl || !email) {
      return NextResponse.json({ error: "Image and email are required" }, { status: 400 });
    }

    // Logic using if-else to bypass the indexing error
    let tierLabel = "Detailed Report";
    if (tier === 'free') {
      tierLabel = "Free Overview";
    } else if (tier === 'premium') {
      tierLabel = "Premium Report";
    } else if (tier === 'subscription') {
      tierLabel = "Monthly Membership";
    }

    const prompt = `You are an expert Hast Rekha consultant. Analyze this palm: ${imageUrl}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ success: true, data: completion.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}