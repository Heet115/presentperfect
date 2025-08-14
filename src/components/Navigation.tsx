'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Find Gifts', icon: Gift },
    { href: '/saved-gifts', label: 'Saved Ideas', icon: Heart },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center space-x-2 py-4 px-3 border-b-2 transition-colors font-medium",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}