import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function SnapVerseHeader() {
  return (
    <header className="py-4 px-6 border-b border-border shadow-sm">
      <div className="container mx-auto">
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors">
          <Sparkles className="h-7 w-7 text-accent-foreground" />
          SnapVerse
        </Link>
      </div>
    </header>
  );
}
