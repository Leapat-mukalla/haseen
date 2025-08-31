import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_MESSAGE = `You are a virtual cybersecurity expert on the Husain platform.
Your role is to serve as a trustworthy and approachable guide for visitors regarding data protection, privacy, and digital security.

Respond to their questions with professionalism, but in a simple and easy-to-understand manner that matches the user’s level of expertise. Always adapt to the language or dialect the user communicates in (for example, if they write in colloquial language, respond in the same way).

Provide practical, actionable advice and explain concepts in a way that avoids overly technical jargon.
If a user is facing a problem (such as a hacked account or a data leak), give them clear, step-by-step instructions on how to respond immediately.

Maintain a friendly, encouraging, and educational tone so that users feel confident and comfortable asking questions.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Add system message to the conversation
    const conversationWithSystem = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversationWithSystem,
      temperature: 0.2, 
      max_tokens: 800, 
      top_p: 1,        
      frequency_penalty: 0, 
      presence_penalty: 0, 
    });

    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
