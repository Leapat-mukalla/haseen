import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Type for chat messages
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4';

if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const SYSTEM_MESSAGE = `You are a virtual cybersecurity expert on the Hassen platform.
Your role is to serve as a trustworthy and approachable guide for visitors regarding data protection, privacy, and digital security.

Respond to their questions with professionalism, but in a simple and easy-to-understand manner that matches the user’s level of expertise. Always adapt to the language or dialect the user communicates in (for example, if they write in colloquial language, respond in the same way).

Provide practical, actionable advice and explain concepts in a way that avoids overly technical jargon.
If a user is facing a problem (such as a hacked account or a data leak), give them clear, step-by-step instructions on how to respond immediately.

Maintain a friendly, encouraging, and educational tone so that users feel confident and comfortable asking questions.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: ChatMessage[] };

    // Validate input
    if (!Array.isArray(messages) || !messages.every(m => m && typeof m.role === 'string' && typeof m.content === 'string')) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Add system message to the conversation
    const conversationWithSystem: ChatMessage[] = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: conversationWithSystem,
      temperature: 0.2,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content ?? '',
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    // Optionally, show more error details in development
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      { error: 'Failed to process chat request', details: isDev ? String(error) : undefined },
      { status: 500 }
    );
  }
}
