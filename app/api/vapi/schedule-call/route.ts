import { NextResponse } from 'next/server';
import { VapiClient } from "@vapi-ai/server-sdk";

const client = new VapiClient({ token: process.env.VAPI_API_KEY! });

// Load Twilio Mother's Day numbers from environment variable
const twilioMothersDayNumbers = process.env.TWILIO_MOTHERS_DAY_NUMBERS
  ? JSON.parse(process.env.TWILIO_MOTHERS_DAY_NUMBERS)
  : [];
let currentTwilioIndex = 0;
function getNextTwilioNumberId() {
  if (twilioMothersDayNumbers.length === 0) throw new Error('No Twilio numbers configured');
  const id = twilioMothersDayNumbers[currentTwilioIndex].id;
  currentTwilioIndex = (currentTwilioIndex + 1) % twilioMothersDayNumbers.length;
  return id;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { cartesiaVoiceId, name, firstMessage, customer: customerNumber } = body;

    if (!customerNumber || !cartesiaVoiceId || !name || !firstMessage) {
      return NextResponse.json(
        { error: 'customer, cartesiaVoiceId, name, and firstMessage are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(customerNumber)) {
      return NextResponse.json(
        { error: 'Phone number must be in E.164 format (e.g., +1XXXXXXXXXX) with country code' },
        { status: 400 }
      );
    }

    if (customerNumber.length < 3 || customerNumber.length > 40) {
      return NextResponse.json(
        { error: 'Phone number must be between 3 and 40 characters' },
        { status: 400 }
      );
    }

    const assistantId = 'ebee428e-47d6-4511-b77f-1cd607d2c877';
    const phoneNumberId = getNextTwilioNumberId();

    const assistantOverrides = {
      voice: {
        provider: "cartesia" as any,
        voiceId: cartesiaVoiceId,
      },
      firstMessage,
      variableValues: {
        name: name,
      }
    } as any;

    const customer = {
      number: customerNumber
    };

    try {
      const call = await client.calls.create({
        assistantId,
        phoneNumberId,
        customer,
        assistantOverrides,
      });

      return NextResponse.json({
        success: true,
        call: call
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to schedule call' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to schedule call' },
      { status: 500 }
    );
  }
} 