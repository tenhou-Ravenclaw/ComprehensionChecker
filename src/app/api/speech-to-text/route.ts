import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // OpenAI SDK expects a File-like object. Next.js Request FormData provides standard File objects.
    // However, sometimes we need to ensure it has the correct properties (name, type).
    // The received File object is usually sufficient.

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'ja',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json({ error: 'Error processing audio' }, { status: 500 });
  }
}

