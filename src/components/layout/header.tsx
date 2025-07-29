'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Recycle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/sorcast', label: 'SORCAST' },
  { href: '/smartbriq', label: 'Smartbriq' },
  { href: '/e-cowaste', label: 'E-Cowaste' },
  { href: '/quality-assessment', label: 'Quality Assessment' },
];

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Recycle className="h-6 w-6" />
          <span className="text-lg font-bold font-headline">GreenLoops</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-primary text-primary-foreground">
            <div className="flex flex-col gap-6 p-6">
              <Link href="/" className="flex items-center gap-2 mb-4" onClick={() => setSheetOpen(false)}>
                <Recycle className="h-6 w-6" />
                <span className="text-lg font-bold font-headline">GreenLoops</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg transition-colors hover:text-accent"
                    onClick={() => setSheetOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
