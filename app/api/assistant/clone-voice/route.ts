import { NextResponse } from 'next/server';
import { CartesiaClient } from "@cartesia/cartesia-js";
import { createReadStream } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile } from 'fs/promises';

const client = new CartesiaClient({ 
  apiKey: process.env.CARTESIA_API_KEY!
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;
    const name = formData.get('name') as string;

    if (!audioBlob || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tempFilePath = join(tmpdir(), `audio-${Date.now()}.wav`);
    const buffer = Buffer.from(await audioBlob.arrayBuffer());
    await writeFile(tempFilePath, buffer);
    const stream = createReadStream(tempFilePath);

    const voice = await client.voices.clone(stream, {
      name,
      mode: "similarity",
      language: "en",
      enhance: true
    });

    return NextResponse.json({
      voiceId: voice.id,
      name: voice.name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to clone voice' },
      { status: 500 }
    );
  }
} 