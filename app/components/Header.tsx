import React from 'react';
import { Menu, Search } from 'lucide-react';
import { Button } from './ui/Button';
import { UserButton } from '@clerk/nextjs';
import SearchDialog from './SearchDialog';
import NotificationsDropdown from './NotificationsDropdown';
import { type Todo } from '@/app/lib/supabase';

interface HeaderProps {
  onMenuClick: () => void;
  todos: Todo[];
  onTodoClick: (todo: Todo) => void;
}

export default function Header({ onMenuClick, todos, onTodoClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <>
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-white/10 backdrop-blur-md fixed w-full top-0 z-50">
        {/* Menu Button*/}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick}
          className="text-white hover:bg-white/20"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Search and Notifications */}
        <div className="flex items-center gap-6">

          {/* Search Button*/}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications Button*/}
          <NotificationsDropdown todos={todos} onTodoClick={onTodoClick} />

          {/* User Button*/}
          <UserButton 
            afterSignOutUrl="/auth" 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9",
                userButtonTrigger: "hover:bg-white/20 rounded-md p-0.5",
                userButtonPopoverCard: "bg-white/10 backdrop-blur-md border border-white/10",
                userButtonPopoverFooter: "border-t border-white/10",
                userPreviewMainIdentifier: "text-white",
                userPreviewSecondaryIdentifier: "text-white/70",
                userButtonBox: "border-2 border-white/20 rounded-full"
              }
            }} 
          />
        </div>
      </header>

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        todos={todos}
        onTodoClick={onTodoClick}
      />
    </>
  );
} 