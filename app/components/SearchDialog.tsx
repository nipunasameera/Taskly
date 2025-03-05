import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, Clock } from 'lucide-react';
import { type Todo } from '@/app/lib/supabase';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  todos: Todo[];
  onTodoClick: (todo: Todo) => void;
}

// Utility component for visually hidden elements
// const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
//   <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
//     {children}
//   </span>
// );

// The SearchDialog component
export default function SearchDialog({ isOpen, onClose, todos, onTodoClick }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredTodos = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return todos.filter(todo => 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todos, searchQuery]);

  // Format the time for display
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  // Format the date for display
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-24 -translate-x-1/2 w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6 text-white shadow-xl pt-12">
          <Dialog.Title className="sr-only">
            Search Todos
          </Dialog.Title>
          
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
            <Search className="w-5 h-5 text-white/70" />
            <input
              type="text"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/50"
              autoFocus
            />
          </div>

          <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredTodos.map((todo) => (
              <button
                key={todo.id}
                onClick={() => {
                  onTodoClick(todo);
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex-1">
                  <p className={todo.completed ? 'line-through text-white/50' : 'text-white'}>
                    {todo.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-white/70">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(todo.due_time)}</span>
                    <span>•</span>
                    <span>{formatDate(todo.due_date)}</span>
                  </div>
                </div>
              </button>
            ))}

            {searchQuery.trim() && filteredTodos.length === 0 && (
              <p className="text-center text-white/50 py-4">
                No todos found matching &quot;{searchQuery}&quot;
              </p>
            )}

            {!searchQuery.trim() && (
              <p className="text-center text-white/50 py-4">
                Start typing to search your todos
              </p>
            )}
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 