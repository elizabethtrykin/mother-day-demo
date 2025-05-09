import twilio from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  throw new Error('Missing required Twilio credentials in environment variables');
}

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to: string, message: string) {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER as string
    });
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function makeCall(to: string, twimlUrl: string) {
  try {
    const response = await twilioClient.calls.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER as string,
      url: twimlUrl
    });
    return response;
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
} 