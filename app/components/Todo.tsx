'use client'

import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, Plus, Trash2, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import Header from './Header';
import Sidebar from './Sidebar';
import AddTodoDialog from './AddTodoDialog';
import { useUser } from '@clerk/nextjs';
import { addTodo, getTodos, updateTodo, deleteTodo, type Todo as DBTodo, type List as DBList, getLists , getListByName} from '@/app/lib/supabase';

// Define the Tag interface
interface Tag {
  id: string;
  name: string;
  color: string;
}

// Define the default tags
const defaultTags: Tag[] = [
  { id: 'Priority_1', name: '#important', color: '#F59E0B' },
  { id: 'Priority_2', name: '#urgent', color: '#DC2626' },
  { id: 'Priority_3', name: '#routine', color: '#22C55E' },
];

interface GroupedTodos {
  [key: string]: {
    title: string;
    todos: DBTodo[];
  };
}

export default function TodoList() {
  const [todos, setTodos] = React.useState<DBTodo[]>([]);
  const [lists, setLists] = React.useState<DBList[]>([]);
  const [tags] = React.useState<Tag[]>(defaultTags);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('all');
  const { user } = useUser();

  // Reset to 'all' tab when user changes
  React.useEffect(() => {
    setActiveTab('all');
  }, [user?.id]);

  // Fetch todos on component mount and when user changes
  React.useEffect(() => {
    if (user?.id) {
      getTodos(user.id)
        .then(setTodos)
        .catch((error) => {
          console.error('Failed to fetch todos:', error);
        });
    }
  }, [user?.id]);

  // Fetch lists on component mount and when user changes
  React.useEffect(() => {
    if (user?.id) {
      getLists(user.id)
        .then(setLists)
        .catch((error) => {
          console.error('Failed to fetch lists:', error);
          // You might want to show an error message to the user here
        });
    }
  }, [user?.id]);

  // Function to refresh lists
  const refreshLists = async () => {
    if (!user?.id) {
      console.error('No user ID available');
      return;
    }
    try {
      const updatedLists = await getLists(user.id);
      setLists(updatedLists);
    } catch (error) {
      console.error('Failed to refresh lists:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Handle adding a new todo
  const handleAddTodo = async (data: { text: string; dueDate: string; dueTime: string; listName: string; tags: string[] }) => {
    if (!user?.id) {
      console.error('No user ID available');
      return;
    }

    const list = await getListByName(user.id, data.listName);

    try {
      console.log('Adding todo with data:', {
        owner_id: user.id,
        text: data.text,
        list_id: data.listName,
        due_date: data.dueDate,
        due_time: data.dueTime,
        completed: false
      });

      const newTodo = await addTodo({
        owner_id: user.id,
        text: data.text,
        list_name: data.listName,
        list_id: list?.id,
        due_date: data.dueDate,
        due_time: data.dueTime,
        completed: false,
        tags: data.tags
      });

      setTodos(prev => [...prev, newTodo]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleToggleTodo = async (todo: DBTodo) => {
    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed
      });

      setTodos(prev =>
        prev.map(t => t.id === updatedTodo.id ? updatedTodo : t)
      );
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
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

  const groupTodosByDate = (todos: DBTodo[]) => {
    const grouped = todos.reduce((acc: GroupedTodos, todo) => {
      const dateKey = todo.due_date;
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
      group.todos.sort((a, b) => a.due_time.localeCompare(b.due_time));
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

    let filtered: DBTodo[];
    switch (activeTab) {
      case 'today':
        filtered = todos.filter((todo) => {
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
        break;
      case 'upcoming':
        filtered = todos.filter((todo) => {
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() > today.getTime();
        });
        break;
      case 'completed':
        filtered = todos.filter((todo) => todo.completed);
        break;
      case 'Priority_1':
      case 'Priority_2':
      case 'Priority_3':
        filtered = todos.filter((todo) => todo.tags?.includes(activeTab));
        break;
      case 'all':
      default:
        filtered = todos;  // Show all todos for 'all' tab
        lists.forEach(element => {
          if (element.name === activeTab) {
            
            filtered = todos.filter((todo) => todo.list_name === element.name);
          }
        });
    }

    return groupTodosByDate(filtered);
  }, [todos, activeTab]);

  const handleTodoClick = (todo: DBTodo) => {
    // Scroll to the todo's date section
    const dateSection = document.getElementById(`date-${todo.due_date}`);
    if (dateSection) {
      dateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRefreshLists = () => {
    setIsDialogOpen(true);
    refreshLists();
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        todos={todos}
        onTodoClick={handleTodoClick}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={() => setIsSidebarOpen(false)}
        lists={lists}
        tags={tags}
        onListCreated={refreshLists}
      />
      
      <main
        className={`transition-all duration-300 ease-in-out pt-6 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* <div className="max-w-3xl mx-auto p-6"></div> */}
        <div className={`max-w-3xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 flex flex-col justify-center p-6`}>
          <div className="mb-8 text-white text-center">
            <h2 className="lg:text-3xl sm:text-2xl font-semibold">
              Welcome, {user?.firstName || 'User'} | {formatDate(new Date())}
            </h2>
          </div>
          <div className="mb-6">
            <Button 
              onClick={handleRefreshLists}
              size="default"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/10 backdrop-blur-sm w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </Button>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {Object.entries(filteredTodos).map(([date, group]) => (
              <div key={date} id={`date-${date}`} className="space-y-2">
                <h2 className="text-white text-base sm:text-lg font-semibold mb-3">
                  {group.title}
                </h2>
                {group.todos.map((todo) => (

                  <div
                    key={todo.id}
                    className="flex items-center gap-5 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors duration-200 group overflow-hidden"
                  >
                    <Checkbox.Root
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo)}
                      className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50"
                    >
                      <Checkbox.Indicator>
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-white text-sm sm:text-base ${
                          todo.completed ? 'line-through opacity-50' : ''
                        }`}>
                          {todo.text}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                          {lists.find(list => list.name === todo.list_name)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-white/70 text-xs sm:text-sm">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formatTime(todo.due_time)}</span>
                        </div>
                      </div>

                      <div className="flex flex-row bottom-0 left-0 transition-all duration-300 group-hover:opacity-100 group-hover:max-h-24 opacity-0 max-h-0 overflow-hidden ease-in-out transform -translate-y-5 group-hover:translate-y-0">
                          { todo.tags ? todo.tags.map((tag) => {
                            return (
                              
                              <span key={tag} className={`text-xs px-3 py-0.5 rounded-[8%] mt-2 mr-2 text-white/70`} style={{backgroundColor: defaultTags.find(t => t.id === tag)?.color}}>
                                {defaultTags.find(t => t.id === tag)?.name}
                              </span>
                            )
                          }) : null}
                      </div>

                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-white/70 hover:text-white hover:bg-white/20"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
        onSubmit={handleAddTodo}
        lists={lists}
      />
    </div>
  );
} 