import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { X, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/app/lib/utils';

// A dialog component for adding a new todo
interface TodoList {
  id: string;
  name: string;
  icon: 'personal' | 'work';
}

// Define the Tag interface
interface Tag {
  id: string;
  name: string;
  color: string;
}

const defaultTags: Tag[] = [
  { id: 'Priority_1', name: '#important', color: '#F59E0B' },
  { id: 'Priority_2', name: '#urgent', color: '#DC2626' },
  { id: 'Priority_3', name: '#routine', color: '#22C55E' },
];

// Props for the AddTodoDialog component
interface AddTodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; dueDate: string; dueTime: string; listId: string; tags: string[] }) => void;
  lists: TodoList[];
}

// The AddTodoDialog component
export default function AddTodoDialog({ isOpen, onClose, onSubmit, lists }: AddTodoDialogProps) {
  const [text, setText] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [dueTime, setDueTime] = React.useState('');
  const [selectedList, setSelectedList] = React.useState(lists[0]?.id || '');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ text, dueDate, dueTime, listId: selectedList, tags: selectedTags });
    setText('');
    setDueDate('');
    setDueTime('');
    setSelectedList(lists[0]?.id || '');
    onClose();
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
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
              <label className="block text-sm">
                List
              </label>
              <Select.Root value={selectedList} onValueChange={setSelectedList}>
                <Select.Trigger
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 text-white flex items-center justify-between"
                >
                  <Select.Value>
                    {lists.find(list => list.id === selectedList)?.name || 'Select a list'}
                  </Select.Value>
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="bg-white/10 backdrop-blur-md border border-white/10 rounded-md overflow-hidden">
                    <Select.Viewport>
                      {lists.map((list) => (
                        <Select.Item
                          key={list.id}
                          value={list.id}
                          className="px-3 py-2 text-white hover:bg-white/10 focus:bg-white/20 focus:outline-none cursor-pointer flex items-center gap-2"
                        >
                          <Select.ItemText>{list.name}</Select.ItemText>
                          <Select.ItemIndicator>
                            <Check className="h-4 w-4" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <label className="block text-sm">
                Tags
              </label>
              <div className="flex flex-wrap gap-3">
                {defaultTags.map((tag) => (
                  <div 
                    key={tag.id} 
                    style={{
                      backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'rgba(255, 255, 255, 0.1)',
                      borderColor: selectedTags.includes(tag.id) ? tag.color : 'rgba(255, 255, 255, 0.1)'
                    }}
                    className={cn(
                      'flex items-center justify-center w-auto h-auto pt-1 pb-1 pl-2 pr-2 rounded-[8%] cursor-pointer transition-colors duration-200',
                      selectedTags.includes(tag.id) ? 'text-white' : 'text-white/90'
                    )} 
                    onClick={() => toggleTag(tag.id)}
                  >
                    <p>{tag.name}</p>
                  </div>
                ))}
              </div>
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