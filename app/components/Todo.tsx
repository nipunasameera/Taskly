'use client'

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import Header from './Header';
import Sidebar from './Sidebar';
import AddTodoDialog from './AddTodoDialog';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  dueDate: string;
  dueTime: string;
}

interface GroupedTodos {
  [key: string]: {
    title: string;
    todos: Todo[];
  };
}

export default function TodoList() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('all');

  const addTodo = (data: { text: string; dueDate: string; dueTime: string }) => {
    setTodos([
      ...todos,
      {
        id: Math.random().toString(36).substring(7),
        text: data.text,
        completed: false,
        date: new Date(),
        dueDate: data.dueDate,
        dueTime: data.dueTime,
      },
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const getDateTitle = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todoDate = new Date(date);
    todoDate.setHours(0, 0, 0, 0);

    if (todoDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (todoDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const groupTodosByDate = (todos: Todo[]) => {
    const grouped = todos.reduce((acc: GroupedTodos, todo) => {
      const dateKey = todo.dueDate;
      const dateTitle = getDateTitle(dateKey);

      if (!acc[dateKey]) {
        acc[dateKey] = {
          title: dateTitle,
          todos: [],
        };
      }

      acc[dateKey].todos.push(todo);
      return acc;
    }, {});

    // Sort todos within each group by time
    Object.values(grouped).forEach((group) => {
      group.todos.sort((a, b) => a.dueTime.localeCompare(b.dueTime));
    });

    // Sort groups by date
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .reduce((acc: GroupedTodos, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };

  const filteredTodos = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered: Todo[];
    switch (activeTab) {
      case 'today':
        filtered = todos.filter((todo) => {
          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
        break;
      case 'upcoming':
        filtered = todos.filter((todo) => {
          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() > today.getTime();
        });
        break;
      case 'completed':
        filtered = todos.filter((todo) => todo.completed);
        break;
      default:
        filtered = todos;
    }

    return groupTodosByDate(filtered);
  }, [todos, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main
        className={`transition-all duration-300 ease-in-out pt-20 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="max-w-3xl mx-auto p-6">
          <div className="mb-6">
            <Button 
              onClick={() => setIsDialogOpen(true)}
              size="default"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/10 backdrop-blur-sm w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </Button>
          </div>

          <div className="space-y-8">
            {Object.entries(filteredTodos).map(([date, group]) => (
              <div key={date} className="space-y-2">
                <h2 className="text-white text-lg font-semibold mb-3">
                  {group.title}
                </h2>
                {group.todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-2 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10"
                  >
                    <Checkbox.Root
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="w-6 h-6 flex items-center justify-center rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50"
                    >
                      <Checkbox.Indicator>
                        <Check className="w-4 h-4 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    
                    <div className="flex-1">
                      <p className={`text-white ${
                        todo.completed ? 'line-through opacity-50' : ''
                      }`}>
                        {todo.text}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-white/70 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(todo.dueTime)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-white/70 hover:text-white hover:bg-white/20"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {Object.keys(filteredTodos).length === 0 && (
            <p className="text-center text-white/70 mt-8">
              No tasks found in this category.
            </p>
          )}
        </div>
      </main>

      <AddTodoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={addTodo}
      />
    </div>
  );
} 