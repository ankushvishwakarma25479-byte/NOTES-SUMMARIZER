import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-foreground" />
          <span className="font-bold text-lg hidden sm:inline-block">AI Notes Summarizer</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/auth">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
