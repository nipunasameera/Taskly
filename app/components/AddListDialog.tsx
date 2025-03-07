import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './ui/Button';

// Props for the AddListDialog component
interface AddListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { listName: string; icon: string }) => void;
}

// The AddListDialog component
export default function AddListDialog({ isOpen, onClose, onSubmit }: AddListDialogProps) {
  const [listName, setListName] = React.useState('');
  const [icon, setIcon] = React.useState('listToDo');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ listName, icon });
    setListName('');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6 text-white shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Add New List
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="text" className="block text-sm">
                List Name
              </label>
              <input
                id="listName"
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50"
                placeholder="Enter your list name..."
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/10"
              >
                Add List
              </Button>
            </div>
          </form>

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