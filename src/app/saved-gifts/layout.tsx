import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Gift Ideas - Your Collection',
  description: 'View and manage your saved gift ideas from Present Perfect. Access your personalized gift recommendations anytime.',
  openGraph: {
    title: 'Saved Gift Ideas - Present Perfect',
    description: 'View and manage your saved gift ideas from Present Perfect. Access your personalized gift recommendations anytime.',
    url: '/saved-gifts',
  },
  twitter: {
    title: 'Saved Gift Ideas - Present Perfect',
    description: 'View and manage your saved gift ideas from Present Perfect.',
  },
};

export default function SavedGiftsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}