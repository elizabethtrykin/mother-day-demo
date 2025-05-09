import { NextResponse } from 'next/server';
import { sendSMS } from '@/app/utils/twilio';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    switch (data.message?.type) {
      case 'end-of-call-report': {
        const callerPhoneNumber = data.message.call?.customer?.number;
        
        if (!callerPhoneNumber) {
          return NextResponse.json({ error: 'No caller phone number provided' }, { status: 400 });
        }

        await sendSMS(
          callerPhoneNumber,
          'Thanks for trying out our voice clone! Create your own AI voice clone at https://your-app-url.com'
        );
        break;
      }
      
      default:
        return NextResponse.json({ status: 'ok' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return NextResponse.json({ status: 'ok' });
} 