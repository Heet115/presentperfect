'use client';

import { useState } from 'react';
import { Heart, Share2, RotateCcw, ChevronDown, ChevronUp, Lightbulb, MessageSquare, Copy } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { saveGiftIdea, deleteSavedGiftIdea } from '@/lib/database';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { GiftSuggestion } from '@/lib/gemini';
import { getThemeForOccasion } from '@/lib/themes';

interface GiftSuggestionsProps {
  suggestions: GiftSuggestion[];
  onReset: () => void;
  recipientInfo?: string;
  quizData?: {
    occasion?: string;
    relationship?: string;
  };
}

export default function GiftSuggestions({ suggestions, onReset, recipientInfo, quizData }: GiftSuggestionsProps) {
  const [savedSuggestions, setSavedSuggestions] = useState<Set<number>>(new Set());
  const [savedGiftIds, setSavedGiftIds] = useState<Map<number, string>>(new Map());
  const [expandedReasons, setExpandedReasons] = useState<Set<number>>(new Set());
  const [showCardGenerator, setShowCardGenerator] = useState(false);
  const [selectedGift, setSelectedGift] = useState<GiftSuggestion | null>(null);
  const [cardForm, setCardForm] = useState({
    recipientName: '',
    senderName: '',
    occasion: quizData?.occasion || '',
  });
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [generatingCard, setGeneratingCard] = useState(false);

  const theme = getThemeForOccasion(quizData?.occasion || 'Just because');

  const toggleReason = (index: number) => {
    setExpandedReasons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSave = async (index: number, suggestion: GiftSuggestion) => {
    if (!auth.currentUser) {
      toast.error('Please sign in to save gift ideas');
      return;
    }

    try {
      if (savedSuggestions.has(index)) {
        // Remove from saved
        const giftId = savedGiftIds.get(index);
        if (giftId) {
          await deleteSavedGiftIdea(giftId);
          setSavedGiftIds(prev => {
            const newMap = new Map(prev);
            newMap.delete(index);
            return newMap;
          });
        }
        setSavedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
        toast.success('Gift idea removed from saved items');
      } else {
        // Save to database
        const giftText = `${suggestion.title}: ${suggestion.description}`;
        const giftId = await saveGiftIdea(auth.currentUser.uid, giftText, recipientInfo);
        setSavedGiftIds(prev => new Map(prev).set(index, giftId));
        setSavedSuggestions(prev => new Set(prev).add(index));
        toast.success('Gift idea saved successfully! ✨');
      }
    } catch (error) {
      console.error('Error saving gift idea:', error);
      toast.error('Failed to save gift idea. Please try again.');
    }
  };

  const handleShare = async (suggestion: GiftSuggestion) => {
    const shareText = `${suggestion.title}: ${suggestion.description}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gift Idea from Present Perfect',
          text: shareText,
          url: window.location.href,
        });
        toast.success('Gift idea shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(shareText);
          toast.success('Gift idea copied to clipboard!');
        } catch {
          toast.error('Failed to share gift idea');
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Gift idea copied to clipboard!');
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  const handleGenerateCard = async () => {
    if (!selectedGift || !cardForm.recipientName) {
      toast.error('Please fill in the recipient name');
      return;
    }

    setGeneratingCard(true);
    try {
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftTitle: selectedGift.title,
          giftDescription: selectedGift.description,
          recipientName: cardForm.recipientName,
          occasion: cardForm.occasion,
          relationship: quizData?.relationship || 'friend',
          senderName: cardForm.senderName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate card message');
      }

      const { message } = await response.json();
      setGeneratedMessage(message);
      toast.success('Gift card message generated!');
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error('Failed to generate gift card message. Please try again.');
    } finally {
      setGeneratingCard(false);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      toast.success('Message copied to clipboard!');
    } catch {
      toast.error('Failed to copy message');
    }
  };

  const openCardGenerator = (suggestion: GiftSuggestion) => {
    setSelectedGift(suggestion);
    setShowCardGenerator(true);
    setGeneratedMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className={`bg-gradient-to-br ${theme.gradients.hero} p-4 rounded-xl w-16 h-16 mx-auto mb-5 flex items-center justify-center shadow-lg`}>
          <span className="text-3xl">{theme.emoji}</span>
        </div>
        <h2 className="text-3xl font-bold mb-3">
          Perfect {quizData?.occasion || 'Gift'} Ideas
        </h2>
        <p className="text-xl text-muted-foreground">
          AI-powered suggestions tailored just for them {theme.emoji}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary">
                  {suggestion.title}
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(index, suggestion)}
                    className={cn(
                      "h-8 w-8 p-0",
                      savedSuggestions.has(index) && "text-red-600 hover:text-red-700"
                    )}
                    title={savedSuggestions.has(index) ? 'Remove from saved' : 'Save gift idea'}
                  >
                    <Heart className={cn("h-4 w-4", savedSuggestions.has(index) && "fill-current")} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(suggestion)}
                    className="h-8 w-8 p-0"
                    title="Share gift idea"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openCardGenerator(suggestion)}
                    className="h-8 w-8 p-0"
                    title="Generate gift card message"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed mb-4">{suggestion.description}</p>
              
              {/* Why This Gift Section */}
              <div className="border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleReason(index)}
                  className="w-full justify-between p-2 h-auto text-left"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Why this gift?</span>
                  </div>
                  {expandedReasons.has(index) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                
                {expandedReasons.has(index) && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {suggestion.reasoning}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Take Quiz Again
        </Button>
      </div>

      {savedSuggestions.size > 0 && (
        <Alert className="mt-8">
          <AlertDescription className="text-center">
            ✨ You&apos;ve saved {savedSuggestions.size} gift idea{savedSuggestions.size !== 1 ? 's' : ''}
          </AlertDescription>
        </Alert>
      )}

      {/* Gift Card Generator Dialog */}
      <Dialog open={showCardGenerator} onOpenChange={setShowCardGenerator}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Gift Card Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedGift && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">{selectedGift.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedGift.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recipient Name *</Label>
                <Input
                  value={cardForm.recipientName}
                  onChange={(e) => setCardForm(prev => ({ ...prev, recipientName: e.target.value }))}
                  placeholder="Who is this gift for?"
                />
              </div>
              <div className="space-y-2">
                <Label>Your Name (optional)</Label>
                <Input
                  value={cardForm.senderName}
                  onChange={(e) => setCardForm(prev => ({ ...prev, senderName: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Occasion</Label>
              <Input
                value={cardForm.occasion}
                onChange={(e) => setCardForm(prev => ({ ...prev, occasion: e.target.value }))}
                placeholder="Birthday, Christmas, etc."
              />
            </div>

            <Button 
              onClick={handleGenerateCard} 
              disabled={generatingCard || !cardForm.recipientName}
              className="w-full"
            >
              {generatingCard ? 'Generating...' : 'Generate Message'}
            </Button>

            {generatedMessage && (
              <div className="space-y-3">
                <Label>Your Personalized Message:</Label>
                <div className="relative">
                  <Textarea
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                    rows={4}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyMessage}
                    className="absolute top-2 right-2"
                    title="Copy message"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  You can edit this message before copying or using it on your gift card.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}