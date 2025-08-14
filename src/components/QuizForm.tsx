'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { QuizData } from '@/lib/gemini';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';


interface QuizFormProps {
  onSubmit: (data: QuizData) => void;
  loading: boolean;
}

export default function QuizForm({ onSubmit, loading }: QuizFormProps) {
  const [formData, setFormData] = useState<QuizData>({
    age: '',
    gender: '',
    interests: [],
    personality: '',
    budget: '',
    occasion: '',
    relationship: '',
    quizMode: 'quick'
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const interests = [
    'Technology', 'Art & Crafts', 'Sports', 'Music', 'Reading', 'Cooking',
    'Travel', 'Gaming', 'Fashion', 'Fitness', 'Photography', 'Gardening'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="bg-primary/10 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Gift Personality Quiz</CardTitle>
          <p className="text-xl text-muted-foreground">Tell us about the person you&apos;re shopping for</p>
          
          {/* Quiz Mode Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-muted/50 rounded-lg">
            <Label htmlFor="quiz-mode" className="text-sm font-medium">
              Quick Quiz (5 gifts)
            </Label>
            <Switch
              id="quiz-mode"
              checked={formData.quizMode === 'detailed'}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, quizMode: checked ? 'detailed' : 'quick' }))
              }
            />
            <Label htmlFor="quiz-mode" className="text-sm font-medium">
              Detailed Quiz (7 gifts)
            </Label>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age */}
            <div className="space-y-2">
              <Label>Age Range</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
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

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
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

            {/* Interests */}
            <div className="space-y-3">
              <Label>Interests (select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {interests.map((interest) => (
                  <Button
                    key={interest}
                    type="button"
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInterestToggle(interest)}
                    className="justify-start"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Personality */}
            <div className="space-y-2">
              <Label>Personality Type</Label>
              <Select value={formData.personality} onValueChange={(value) => setFormData(prev => ({ ...prev, personality: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select personality type" />
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

            {/* Budget */}
            <div className="space-y-2">
              <Label>Budget Range</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under ₹2,000">Under ₹2,000</SelectItem>
                  <SelectItem value="₹2,000-₹4,000">₹2,000-₹4,000</SelectItem>
                  <SelectItem value="₹4,000-₹8,000">₹4,000-₹8,000</SelectItem>
                  <SelectItem value="₹8,000-₹20,000">₹8,000-₹20,000</SelectItem>
                  <SelectItem value="₹20,000+">₹20,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Occasion */}
            <div className="space-y-2">
              <Label>Occasion</Label>
              <Select value={formData.occasion} onValueChange={(value) => setFormData(prev => ({ ...prev, occasion: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Birthday">Birthday</SelectItem>
                  <SelectItem value="Christmas">Christmas</SelectItem>
                  <SelectItem value="Anniversary">Anniversary</SelectItem>
                  <SelectItem value="Valentine's Day">Valentine&apos;s Day</SelectItem>
                  <SelectItem value="Graduation">Graduation</SelectItem>
                  <SelectItem value="Just because">Just because</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <Label>Your relationship to them</Label>
              <Select value={formData.relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
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

            <Button
              type="submit"
              disabled={loading || formData.interests.length === 0}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin mr-2" />
                  Finding perfect gifts...
                </>
              ) : (
                <>
                  Get Gift Suggestions
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}