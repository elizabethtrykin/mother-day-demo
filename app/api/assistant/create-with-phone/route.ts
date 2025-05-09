import { NextResponse } from 'next/server';
import { VapiClient } from "@vapi-ai/server-sdk";

const client = new VapiClient({ token: process.env.VAPI_API_KEY! });

const MOTHERS_DAY_PROMPT = `You are a voice agent designed to deliver a heartfelt Mother's Day message. You should:

1. Sound exactly like the person whose voice was cloned
2. Deliver the message with warmth and emotion
3. Keep the conversation natural and personal
4. If the mother responds, engage in a brief, meaningful conversation
5. Express gratitude and love in a way that feels authentic to the sender

The message to deliver is:`;

export async function POST(request: Request) {
  try {
    const { voiceId, phoneNumber, message } = await request.json();

    if (!voiceId || !phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Voice ID, phone number, and message are required' },
        { status: 400 }
      );
    }

    // Create Vapi assistant with the cloned voice
    console.log('Creating Vapi assistant...');
    const assistant = await client.assistants.create({
      name: "Mother's Day Message",
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${MOTHERS_DAY_PROMPT}\n\n${message}`
          }
        ]
      },
      voice: {
        provider: "cartesia",
        voiceId: voiceId
      },
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en"
      },
      firstMessageMode: "assistant-speaks-first",
      backgroundSound: "off"
    });

    // Create a phone number and assign it to the assistant
    console.log('Creating phone number...');
    const phoneNumberResponse = await client.phoneNumbers.create({
      assistantId: assistant.id,
      phoneNumber: phoneNumber
    });

    return NextResponse.json({
      success: true,
      message: "Message will be delivered shortly"
    });
  } catch (error: any) {
    console.error('Error in create-with-phone:', {
      error,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: error.message || 'Failed to create assistant and set up call' },
      { status: 500 }
    );
  }
} 