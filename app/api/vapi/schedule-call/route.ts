import { NextResponse } from 'next/server';
import { VapiClient } from "@vapi-ai/server-sdk";

const client = new VapiClient({ token: process.env.VAPI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { cartesiaVoiceId, name, firstMessage, phoneNumber } = await request.json();

    if (!phoneNumber || !cartesiaVoiceId || !name || !firstMessage) {
      return NextResponse.json(
        { error: 'phoneNumber, cartesiaVoiceId, name, and firstMessage are required' },
        { status: 400 }
      );
    }

    const assistantId = 'ebee428e-47d6-4511-b77f-1cd607d2c877';

    const assistantOverrides = {
      voice: {
        provider: "cartesia" as any,
        voiceId: cartesiaVoiceId,
      },
      firstMessage,
      variableValues: {
        name,
      },
      serverMessages: [],
    };

    await client.calls.create({
      assistantId,
      phoneNumber,
      assistantOverrides,
    });

    return NextResponse.json({
      success: true,
      assistantId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to schedule call' },
      { status: 500 }
    );
  }
} 