import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-white/10 backdrop-blur-md fixed w-full top-0 z-50">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuClick}
        className="text-white hover:bg-white/20"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
} 