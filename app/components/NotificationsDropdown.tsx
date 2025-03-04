import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Bell } from 'lucide-react';
import { type Todo } from '@/app/lib/supabase';

interface NotificationsDropdownProps {
  todos: Todo[];
  onTodoClick: (todo: Todo) => void;
}

export default function NotificationsDropdown({ todos, onTodoClick }: NotificationsDropdownProps) {
  const [upcomingTodos, setUpcomingTodos] = React.useState<Todo[]>([]);
  
  // Function to check for upcoming todos
  const checkUpcomingTodos = React.useCallback(() => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const upcoming = todos.filter(todo => {
      if (todo.completed) return false;
      
      const dueDateTime = new Date(`${todo.due_date}T${todo.due_time}`);
      return dueDateTime > now && dueDateTime <= oneHourFromNow;
    });

    setUpcomingTodos(upcoming);
  }, [todos]);

  // Initial check and setup periodic checking
  React.useEffect(() => {
    // Check immediately
    checkUpcomingTodos();

    // Set up interval to check every minute
    const intervalId = setInterval(checkUpcomingTodos, 60000); // 60000ms = 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [checkUpcomingTodos]);

  const formatTimeRemaining = (dueDate: string, dueTime: string) => {
    const now = new Date();
    const dueDateTime = new Date(`${dueDate}T${dueTime}`);
    const diffInMinutes = Math.floor((dueDateTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Due now';
    if (diffInMinutes < 60) return `Due in ${diffInMinutes} minutes`;
    return 'Due in 1 hour';
  };

  const hasNotifications = upcomingTodos.length > 0;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="relative text-white/70 hover:text-white">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-80 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow-xl p-4 text-white mt-2"
          align="end"
          sideOffset={5}
        >
          <h3 className="text-sm font-medium mb-2">Upcoming Tasks</h3>
          
          <div className="space-y-2">
            {upcomingTodos.length > 0 ? (
              upcomingTodos.map(todo => (
                <button
                  key={todo.id}
                  onClick={() => onTodoClick(todo)}
                  className="w-full text-left p-2 rounded hover:bg-white/5 transition-colors"
                >
                  <p className="text-sm font-medium">{todo.text}</p>
                  <p className="text-xs text-white/70">
                    {formatTimeRemaining(todo.due_date, todo.due_time)}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-sm text-white/50 text-center py-2">
                No upcoming tasks within the next hour
              </p>
            )}
          </div>

          <Popover.Arrow className="fill-white/10" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
} 