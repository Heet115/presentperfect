'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Edit2, Save, ArrowLeft, Plus, Users, Trash2 } from 'lucide-react';
import { getUserProfile, updateUserProfile, UserProfile as UserProfileType, getRecipientProfiles, saveRecipientProfile, deleteRecipientProfile, RecipientProfile } from '@/lib/database';
import { updateProfile } from 'firebase/auth';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ErrorDialog } from '@/components/ui/error-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<RecipientProfile[]>([]);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    age: '',
    gender: '',
    interests: [] as string[],
    personality: '',
    relationship: '',
    notes: ''
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setPageLoading(false);
      if (!user) {
        router.push('/');
      } else {
        loadUserProfile(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadUserProfile = async (currentUser: import('firebase/auth').User) => {
    try {
      const [userProfile, recipientProfiles] = await Promise.all([
        getUserProfile(currentUser.uid),
        getRecipientProfiles(currentUser.uid)
      ]);
      setProfile(userProfile);
      setName(userProfile?.name || '');
      setRecipients(recipientProfiles);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      await updateProfile(user, { displayName: name });
      await updateUserProfile(user.uid, { name });
      
      setProfile({ ...profile, name });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const interests = [
    'Technology', 'Art & Crafts', 'Sports', 'Music', 'Reading', 'Cooking',
    'Travel', 'Gaming', 'Fashion', 'Fitness', 'Photography', 'Gardening'
  ];

  const handleInterestToggle = (interest: string) => {
    setNewRecipient(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAddRecipient = async () => {
    if (!user || !newRecipient.name || !newRecipient.age || !newRecipient.gender || 
        !newRecipient.personality || !newRecipient.relationship || newRecipient.interests.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await saveRecipientProfile(user.uid, newRecipient);
      const updatedRecipients = await getRecipientProfiles(user.uid);
      setRecipients(updatedRecipients);
      setNewRecipient({
        name: '',
        age: '',
        gender: '',
        interests: [],
        personality: '',
        relationship: '',
        notes: ''
      });
      setShowAddRecipient(false);
      toast.success('Recipient profile saved successfully!');
    } catch (error) {
      console.error('Error saving recipient:', error);
      setError('Failed to save recipient profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipient = async (recipientId: string) => {
    if (!user) return;
    
    try {
      await deleteRecipientProfile(recipientId);
      const updatedRecipients = await getRecipientProfiles(user.uid);
      setRecipients(updatedRecipients);
      toast.success('Recipient profile deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipient:', error);
      setError('Failed to delete recipient profile. Please try again.');
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-6">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {(profile?.name || user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl">Your Profile</CardTitle>
              <p className="text-muted-foreground">Manage your account information</p>
            </CardHeader>

            <CardContent>
              {profile ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Name</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    ) : (
                      <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg">
                        <p className="text-base">{profile.name || 'Not set'}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Email</Label>
                    <div className="bg-muted px-4 py-3 rounded-lg">
                      <p className="text-base">{profile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Member Since</Label>
                    <div className="bg-muted px-4 py-3 rounded-lg">
                      <p className="text-base">
                        {profile.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setName(profile.name || '');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipient Profiles Section */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">Recipient Profiles</CardTitle>
                    <p className="text-muted-foreground">Save details about people you shop for</p>
                  </div>
                </div>
                <Dialog open={showAddRecipient} onOpenChange={setShowAddRecipient}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Recipient
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Recipient</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name *</Label>
                          <Input
                            value={newRecipient.name}
                            onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Recipient's name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Age Range *</Label>
                          <Select value={newRecipient.age} onValueChange={(value) => setNewRecipient(prev => ({ ...prev, age: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select age range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-12">0-12 years</SelectItem>
                              <SelectItem value="13-17">13-17 years</SelectItem>
                              <SelectItem value="18-25">18-25 years</SelectItem>
                              <SelectItem value="26-35">26-35 years</SelectItem>
                              <SelectItem value="36-50">36-50 years</SelectItem>
                              <SelectItem value="50+">50+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Gender *</Label>
                          <Select value={newRecipient.gender} onValueChange={(value) => setNewRecipient(prev => ({ ...prev, gender: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Non-binary">Non-binary</SelectItem>
                              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Personality *</Label>
                          <Select value={newRecipient.personality} onValueChange={(value) => setNewRecipient(prev => ({ ...prev, personality: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select personality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Adventurous">Adventurous</SelectItem>
                              <SelectItem value="Creative">Creative</SelectItem>
                              <SelectItem value="Practical">Practical</SelectItem>
                              <SelectItem value="Intellectual">Intellectual</SelectItem>
                              <SelectItem value="Social">Social</SelectItem>
                              <SelectItem value="Minimalist">Minimalist</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Relationship *</Label>
                        <Select value={newRecipient.relationship} onValueChange={(value) => setNewRecipient(prev => ({ ...prev, relationship: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Your relationship to them" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Partner/Spouse">Partner/Spouse</SelectItem>
                            <SelectItem value="Family member">Family member</SelectItem>
                            <SelectItem value="Close friend">Close friend</SelectItem>
                            <SelectItem value="Colleague">Colleague</SelectItem>
                            <SelectItem value="Acquaintance">Acquaintance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>Interests * (select all that apply)</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {interests.map((interest) => (
                            <Button
                              key={interest}
                              type="button"
                              variant={newRecipient.interests.includes(interest) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInterestToggle(interest)}
                              className="justify-start text-xs"
                            >
                              {interest}
                            </Button>
                          ))}
                        </div>
                        {newRecipient.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {newRecipient.interests.map((interest) => (
                              <Badge key={interest} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Notes (optional)</Label>
                        <Textarea
                          value={newRecipient.notes}
                          onChange={(e) => setNewRecipient(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any additional notes about their preferences..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleAddRecipient} disabled={loading} className="flex-1">
                          {loading ? 'Saving...' : 'Save Recipient'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddRecipient(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {recipients.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {recipients.map((recipient) => (
                    <Card key={recipient.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{recipient.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {recipient.age} • {recipient.gender} • {recipient.relationship}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecipient(recipient.id!)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Personality: </span>
                            <Badge variant="outline" className="text-xs">{recipient.personality}</Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Interests: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {recipient.interests.slice(0, 3).map((interest) => (
                                <Badge key={interest} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                              {recipient.interests.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{recipient.interests.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          {recipient.notes && (
                            <div>
                              <span className="text-sm font-medium">Notes: </span>
                              <p className="text-sm text-muted-foreground mt-1">{recipient.notes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recipients yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Save recipient profiles to quickly generate gifts for them next time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <ErrorDialog
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Profile Update Error"
        message={error || ""}
      />
    </div>
  );
}