import { NextRequest, NextResponse } from 'next/server';
import { generateGiftCardMessage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { giftTitle, giftDescription, recipientName, occasion, relationship, senderName } = await request.json();
    
    // Validate required fields
    if (!giftTitle || !giftDescription || !recipientName || !occasion || !relationship) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const message = await generateGiftCardMessage(
      giftTitle,
      giftDescription,
      recipientName,
      occasion,
      relationship,
      senderName
    );
    
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error in generate-card API:', error);
    return NextResponse.json(
      { error: 'Failed to generate gift card message' },
      { status: 500 }
    );
  }
}