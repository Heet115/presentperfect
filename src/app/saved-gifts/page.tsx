'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getSavedGiftIdeas, deleteSavedGiftIdea, SavedGiftIdea } from '@/lib/database';
import { Heart, Trash2, Share2, Gift, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function SavedGiftsPage() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<SavedGiftIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; giftId: string | null }>({
    isOpen: false,
    giftId: null
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setPageLoading(false);
      if (!user) {
        router.push('/');
      } else {
        loadSavedIdeas(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadSavedIdeas = async (currentUser: import('firebase/auth').User) => {
    setLoading(true);
    try {
      const ideas = await getSavedGiftIdeas(currentUser.uid);
      setSavedIdeas(ideas);
    } catch (error) {
      console.error('Error loading saved ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (giftId: string) => {
    setDeleteDialog({ isOpen: true, giftId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.giftId) return;
    
    try {
      await deleteSavedGiftIdea(deleteDialog.giftId);
      setSavedIdeas(prev => prev.filter(idea => idea.id !== deleteDialog.giftId));
      toast.success('Gift idea deleted successfully');
    } catch (error) {
      console.error('Error deleting gift idea:', error);
      toast.error('Failed to delete gift idea. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, giftId: null });
  };

  const handleShare = async (giftIdea: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gift Idea from Present Perfect',
          text: giftIdea,
          url: window.location.origin,
        });
        toast.success('Gift idea shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(giftIdea);
          toast.success('Gift idea copied to clipboard!');
        } catch {
          toast.error('Failed to share gift idea');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(giftIdea);
        toast.success('Gift idea copied to clipboard!');
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {user && <Navigation />}
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="text-center mb-12">
            <div className="bg-primary/10 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Saved Gift Ideas</h1>
            <p className="text-xl text-muted-foreground">Your collection of perfect gifts</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your saved ideas...</p>
            </div>
          ) : savedIdeas.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-muted p-8 rounded-2xl w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No saved ideas yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start taking our quiz and save gift ideas that catch your eye. They&apos;ll appear here for easy access later!
              </p>
              <Button asChild size="lg">
                <Link href="/">
                  <Gift className="h-5 w-5 mr-2" />
                  Find Gift Ideas
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <p className="text-muted-foreground">
                  You have <span className="font-semibold text-primary">{savedIdeas.length}</span> saved gift idea{savedIdeas.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {savedIdeas.map((idea) => (
                  <Card key={idea.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Gift className="h-3 w-3" />
                          <span>Saved Idea</span>
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(idea.giftIdea)}
                            className="h-8 w-8 p-0"
                            title="Share"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(idea.id!)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="leading-relaxed mb-4">{idea.giftIdea}</p>
                      
                      {idea.recipientInfo && (
                        <Alert className="mb-3">
                          <AlertDescription>
                            <span className="font-medium">For:</span> {idea.recipientInfo}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Saved {idea.savedAt?.toDate?.()?.toLocaleDateString() || 'recently'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Gift Idea"
        description="Are you sure you want to delete this gift idea? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}