
'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import QuizForm from '@/components/QuizForm';
import GiftSuggestions from '@/components/GiftSuggestions';
import { QuizData, GiftSuggestion } from '@/lib/gemini';
import { Gift, Sparkles, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { applyOccasionTheme, resetTheme } from '@/lib/themes';

export default function Home() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(true);
  const [currentQuizData, setCurrentQuizData] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleQuizSubmit = async (quizData: QuizData) => {
    setLoading(true);
    setCurrentQuizData(quizData);
    
    // Apply occasion-based theme
    if (quizData.occasion) {
      applyOccasionTheme(quizData.occasion);
    }
    
    try {
      const response = await fetch('/api/generate-gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const { suggestions: giftSuggestions } = await response.json();
      setSuggestions(giftSuggestions);
      setShowQuiz(false);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setError('Sorry, there was an error generating suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuggestions([]);
    setCurrentQuizData(null);
    setShowQuiz(true);
    resetTheme(); // Reset theme when going back to quiz
  };

  const getRecipientInfo = (quizData: QuizData | null) => {
    if (!quizData) return '';
    return `${quizData.age} ${quizData.gender}, ${quizData.relationship} - ${quizData.occasion}`;
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does Present Perfect work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Present Perfect uses AI to analyze your answers to a personality quiz about the gift recipient. Based on their age, interests, personality, and your relationship, our AI generates personalized gift recommendations that are thoughtful and meaningful'
        }
      },
      {
        '@type': 'Question',
        name: 'Is Present Perfect free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Present Perfect is completely free to use. You can take unlimited quizzes, save gift ideas, and generate personalized greeting card messages at no cost.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I save gift ideas for later?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! You can save any gift idea to your personal collection and access them anytime. You can also create recipient profiles to quickly generate gifts for the same people in the future.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      {user && <Navigation />}
      
      <main className="py-12 px-4 sm:px-6 lg:px-8" role="main">
        {showQuiz ? (
          <div>
            {/* Hero Section */}
            <header className="text-center mb-16 max-w-4xl mx-auto">
              <div className="flex justify-center mb-10">
                <div className="bg-primary/10 p-6 rounded-2xl shadow-lg float-animation" role="img" aria-label="Gift icon">
                  <Gift className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Find the <span className="text-primary">Perfect Gift</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                Answer a few quick questions and let AI suggest thoughtful, personalized gifts 
                that will make anyone smile
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-16" role="list" aria-label="Key features">
                <Badge variant="secondary" className="flex items-center space-x-2 px-4 py-2 text-base" role="listitem">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  <span>AI-Powered</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-2 px-4 py-2 text-base" role="listitem">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  <span>Personalized</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-2 px-4 py-2 text-base" role="listitem">
                  <Gift className="h-5 w-5" aria-hidden="true" />
                  <span>Thoughtful</span>
                </Badge>
              </div>
            </header>

            <QuizForm onSubmit={handleQuizSubmit} loading={loading} />
          </div>
        ) : (
          <GiftSuggestions 
            suggestions={suggestions} 
            onReset={handleReset}
            recipientInfo={getRecipientInfo(currentQuizData)}
            quizData={currentQuizData || undefined}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-20" role="contentinfo">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-3">
              <Gift className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-lg font-bold">Present Perfect</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              &copy; 2025 Present Perfect. Making gift-giving effortless with AI.
            </p>
            <nav aria-label="Footer navigation" className="mb-4">
              <div className="flex justify-center space-x-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </div>
            </nav>
            <div className="text-xs text-muted-foreground">
              <p>AI-powered gift recommendations • Personalized for every occasion • Free to use</p>
            </div>
          </div>
        </div>
      </footer>

      <ErrorDialog
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Generation Error"
        message={error || ""}
      />
    </div>
  );
}
