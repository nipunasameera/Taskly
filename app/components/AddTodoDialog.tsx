import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './ui/Button';

interface AddTodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; dueDate: string; dueTime: string }) => void;
}

export default function AddTodoDialog({ isOpen, onClose, onSubmit }: AddTodoDialogProps) {
  const [text, setText] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [dueTime, setDueTime] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ text, dueDate, dueTime });
    setText('');
    setDueDate('');
    setDueTime('');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-6 text-white shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Add New Task
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="text" className="block text-sm">
                Task Description
              </label>
              <input
                id="text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50"
                placeholder="Enter your task..."
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-sm">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dueTime" className="block text-sm">
                Due Time
              </label>
              <input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
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
                Add Task
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