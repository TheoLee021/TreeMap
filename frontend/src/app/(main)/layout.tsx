'use client';

import Navigation from '@/components/Navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>{children}</main>
    </div>
  );
} 