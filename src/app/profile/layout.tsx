import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Profile - Manage Account & Recipients',
  description: 'Manage your Present Perfect account settings and saved recipient profiles for faster gift recommendations.',
  openGraph: {
    title: 'Your Profile - Present Perfect',
    description: 'Manage your account settings and recipient profiles for personalized gift recommendations.',
    url: '/profile',
  },
  twitter: {
    title: 'Your Profile - Present Perfect',
    description: 'Manage your account settings and recipient profiles for personalized gift recommendations.',
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}