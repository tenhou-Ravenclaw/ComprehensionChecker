import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const systemMessage = {
      role: 'system',
      content: context 
        ? `あなたは講義のアシスタントAIです。以下の講義資料（コンテキスト）に基づいて、生徒の質問に答えてください。\n\n[講義資料]\n${context}`
        : 'あなたは親切な講義アシスタントです。',
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [systemMessage, ...messages],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error generating chat response:', error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}

