import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { question1, question2, question3, name } = await request.json();
    if (!question1 || !question2 || !question3 || !name) {
      return NextResponse.json({ error: 'All questions and name are required.' }, { status: 400 });
    }

    const prompt = `Write a heartfelt, original poem for a mom based on the following answers from her child.\n\nChild's name: ${name}\n\nOne beautiful thing mom does: ${question1}\nFavourite memory: ${question2}\nFeeling most associated with mom: ${question3}\n\nPoem:`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.5-preview',
        messages: [
          { role: 'system', content: 'You are a creative and loving poet.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.json();
      return NextResponse.json({ error: error.error?.message || 'Failed to generate poem.' }, { status: 500 });
    }

    const openaiData = await openaiRes.json();
    const poem = openaiData.choices?.[0]?.message?.content?.trim() || '';
    return NextResponse.json({ poem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to generate poem.' }, { status: 500 });
  }
} 