import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import { User } from 'lucide-react';

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <h2 className="text-lg font-semibold lg:hidden">Dashboard</h2>
          <div className="hidden lg:block"></div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border text-foreground hover:bg-border/80 transition cursor-pointer">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background/50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
