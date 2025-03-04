import React from 'react';
import { Calendar, CheckCircle, Clock, ListTodo, Briefcase, User } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  lists: TodoList[];
}

interface TodoList {
  id: string;
  name: string;
  icon: 'personal' | 'work';
}

const tabs = [
  { id: 'all', label: 'All', icon: ListTodo },
  { id: 'today', label: 'Today', icon: Clock },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'completed', label: 'Completed', icon: CheckCircle },
];

const getListIcon = (icon: 'personal' | 'work') => {
  switch (icon) {
    case 'personal':
      return User;
    case 'work':
      return Briefcase;
    default:
      return ListTodo;
  }
};

export default function Sidebar({ isOpen, activeTab, onTabChange, lists }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/10 backdrop-blur-md border-r border-white/10 transition-all duration-300 ease-in-out',
        isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
      )}
    >
      <nav className="p-4 space-y-8">
        <ul className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-white',
                    activeTab === tab.id
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div>
          <h3 className="text-white/70 font-medium px-4 mb-2 text-sm">MY LISTS</h3>
          <ul className="space-y-2">
            {lists.map((list) => {
              const Icon = getListIcon(list.icon);
              return (
                <li key={list.id}>
                  <button
                    onClick={() => onTabChange(list.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-white',
                      activeTab === list.id
                        ? 'bg-white/20'
                        : 'hover:bg-white/10'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{list.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
} 