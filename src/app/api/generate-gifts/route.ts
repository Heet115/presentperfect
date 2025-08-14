import { NextRequest, NextResponse } from 'next/server';
import { generateGiftSuggestions, QuizData } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const quizData: QuizData = await request.json();
    
    // Validate required fields
    if (!quizData.age || !quizData.gender || !quizData.personality || 
        !quizData.budget || !quizData.occasion || !quizData.relationship) {
      return NextResponse.json(
        { error: 'Missing required quiz data' },
        { status: 400 }
      );
    }

    const suggestions = await generateGiftSuggestions(quizData);
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error in generate-gifts API:', error);
    return NextResponse.json(
      { error: 'Failed to generate gift suggestions' },
      { status: 500 }
    );
  }
}