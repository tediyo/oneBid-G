import React from 'react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

