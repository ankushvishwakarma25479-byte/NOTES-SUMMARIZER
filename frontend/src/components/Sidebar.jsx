import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Upload, LayoutDashboard, Folder, History, Bot, LogOut, User } from 'lucide-react';
import { cn } from '../utils/cn';
import { AuthContext } from '../context/AuthContext';

export function Sidebar({ className }) {
  const location = useLocation();
  const { user, logoutContext } = useContext(AuthContext);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Notes', path: '/dashboard/upload', icon: Upload },
    { name: 'My Documents', path: '/dashboard/documents', icon: Folder },
    { name: 'History', path: '/dashboard/history', icon: History },
  ];

  return (
    <div className={cn("hidden h-screen w-64 flex-col border-r border-border bg-background md:flex", className)}>
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-foreground" />
          <span className="font-bold text-lg">AI Notes</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-foreground text-background" 
                    : "text-foreground/70 hover:bg-border/50 hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-foreground/10 flex items-center justify-center">
            <User className="h-4 w-4 text-foreground/70" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
            <span className="text-xs text-foreground/50 truncate w-32">{user?.email || ''}</span>
          </div>
        </div>
        <button
          onClick={logoutContext}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-border/50 hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
