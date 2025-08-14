export interface OccasionTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  emoji: string;
  gradients: {
    hero: string;
    card: string;
  };
}

export const occasionThemes: Record<string, OccasionTheme> = {
  'Birthday': {
    name: 'Birthday',
    colors: {
      primary: 'hsl(291, 64%, 42%)', // Purple
      secondary: 'hsl(291, 64%, 92%)',
      accent: 'hsl(45, 93%, 47%)', // Gold
      background: 'hsl(291, 64%, 98%)',
    },
    emoji: '🎂',
    gradients: {
      hero: 'from-purple-500 to-pink-500',
      card: 'from-purple-50 to-pink-50',
    },
  },
  'Christmas': {
    name: 'Christmas',
    colors: {
      primary: 'hsl(348, 83%, 47%)', // Red
      secondary: 'hsl(348, 83%, 95%)',
      accent: 'hsl(142, 71%, 45%)', // Green
      background: 'hsl(348, 83%, 98%)',
    },
    emoji: '🎄',
    gradients: {
      hero: 'from-red-500 to-green-500',
      card: 'from-red-50 to-green-50',
    },
  },
  'Valentine\'s Day': {
    name: 'Valentine\'s Day',
    colors: {
      primary: 'hsl(348, 83%, 47%)', // Red
      secondary: 'hsl(348, 83%, 95%)',
      accent: 'hsl(330, 81%, 60%)', // Pink
      background: 'hsl(348, 83%, 98%)',
    },
    emoji: '💝',
    gradients: {
      hero: 'from-red-500 to-pink-500',
      card: 'from-red-50 to-pink-50',
    },
  },
  'Anniversary': {
    name: 'Anniversary',
    colors: {
      primary: 'hsl(45, 93%, 47%)', // Gold
      secondary: 'hsl(45, 93%, 95%)',
      accent: 'hsl(348, 83%, 47%)', // Red
      background: 'hsl(45, 93%, 98%)',
    },
    emoji: '💍',
    gradients: {
      hero: 'from-yellow-500 to-orange-500',
      card: 'from-yellow-50 to-orange-50',
    },
  },
  'Graduation': {
    name: 'Graduation',
    colors: {
      primary: 'hsl(221, 83%, 53%)', // Blue
      secondary: 'hsl(221, 83%, 95%)',
      accent: 'hsl(45, 93%, 47%)', // Gold
      background: 'hsl(221, 83%, 98%)',
    },
    emoji: '🎓',
    gradients: {
      hero: 'from-blue-500 to-indigo-500',
      card: 'from-blue-50 to-indigo-50',
    },
  },
  'Just because': {
    name: 'Just because',
    colors: {
      primary: 'hsl(262, 83%, 58%)', // Purple
      secondary: 'hsl(262, 83%, 95%)',
      accent: 'hsl(45, 93%, 47%)', // Gold
      background: 'hsl(262, 83%, 98%)',
    },
    emoji: '✨',
    gradients: {
      hero: 'from-purple-500 to-blue-500',
      card: 'from-purple-50 to-blue-50',
    },
  },
};

export const getThemeForOccasion = (occasion: string): OccasionTheme => {
  return occasionThemes[occasion] || occasionThemes['Just because'];
};

export const applyOccasionTheme = (occasion: string) => {
  const theme = getThemeForOccasion(occasion);
  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--occasion-primary', theme.colors.primary);
  root.style.setProperty('--occasion-secondary', theme.colors.secondary);
  root.style.setProperty('--occasion-accent', theme.colors.accent);
  root.style.setProperty('--occasion-background', theme.colors.background);
};

export const resetTheme = () => {
  const root = document.documentElement;
  root.style.removeProperty('--occasion-primary');
  root.style.removeProperty('--occasion-secondary');
  root.style.removeProperty('--occasion-accent');
  root.style.removeProperty('--occasion-background');
};