'use client';

import { Gift, LogOut, LogIn, Heart, Settings } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthModal from './AuthModal';
import { createUserProfile, getUserProfile, UserProfile } from '@/lib/database';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Create user profile if it doesn't exist
        try {
          await createUserProfile(user);
          // Load user profile to get the name
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthSuccess = () => {
    setUser(auth.currentUser);
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Present Perfect</h1>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/saved-gifts" title="Saved Gift Ideas">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Saved Ideas</span>
                </Link>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {(profile?.name || user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="text-sm">
                  {profile?.name || user.displayName || user.email}
                </Badge>
              </div>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile" title="Profile Settings">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowAuthModal(true)} className="shadow-lg">
              <LogIn className="h-4 w-4 mr-2" />
              <span className="font-medium">Sign In</span>
            </Button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </header>
  );
}