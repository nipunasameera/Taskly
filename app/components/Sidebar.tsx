import React from 'react';
import { Calendar, CheckCircle, Clock, ListTodo, Briefcase, User } from 'lucide-react';
import { type List as DBList, getLists, addList } from '@/app/lib/supabase';
import { cn } from '@/app/lib/utils';
import { Plus } from 'lucide-react';
import AddListDialog from './AddListDialog';
import { useUser } from '@clerk/nextjs';

// Props for the Sidebar component
interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  lists: DBList[];
  tags: Tag[];
  onListCreated: () => void;
}

// Define the Tag interface
interface Tag{
  id: string;
  name: string;
  color: string;
}

// The sidebar component
const tabs = [
  { id: 'all', label: 'All Tasks', icon: ListTodo },
  { id: 'today', label: 'Today', icon: Clock },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'completed', label: 'Completed', icon: CheckCircle },
];

// Utility function to get the icon for a list
const getListIcon = (icon: string) => {
  switch (icon) {
    case 'personal':
      return User;
    case 'work':
      return Briefcase;
    default:
      return ListTodo;
  }
};

export default function Sidebar({ isOpen, activeTab, onTabChange, onClose, tags, onListCreated }: SidebarProps) {

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [lists, setLists] = React.useState<DBList[]>([]);
  const { user } = useUser();

  const handleAddList = async (data: { listName: string; icon: string }) => {
    if (!user?.id) {
      console.error('No user ID available');
      return;
    }
  
    try {
      console.log('Adding list with data:', {
        owner_id: user.id,
        list_name: data.listName,
        icon: data.icon
      });
  
      const newList = await addList({
        owner_id: user.id,
        name : data.listName,
        icon: data.icon
      });
  
      setLists(prev => [...prev, newList]);
      onListCreated();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handlePlusClick = () => {
    setIsDialogOpen(true);

    // Close the sidebar on smaller devices
    if (window.innerWidth < 768) {
      onClose();
    }
  };

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

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/10 backdrop-blur-md border-r border-white/10 transition-all duration-300 ease-in-out z-50',
          isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
        )}
      >
        <nav className="p-4 space-y-8 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
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
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-white/70 font-medium px-4 text-sm">
              MY LISTS
              </h3>
              
              <Plus className="w-5 h-5 mr-2" onClick={handlePlusClick} />
            </div>
            
            <ul className="space-y-2 mt-4">
              {
              lists.map((list) => {
                const Icon = getListIcon(list.icon);
                return (
                  <li key={list.id}>
                    <button
                      onClick={() => onTabChange(list.name)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-white',
                        activeTab === list.name
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

          <div>
            <h3 className="text-white/70 font-medium px-4 mb-2 text-sm">TAGS</h3>
            <ul className="space-y-2">
              {tags.map((tag) => {
                //const Icon = getListIcon(tag.icon);
                return (
                  <li key={tag.id}>
                    <button
                      onClick={() => onTabChange(tag.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-white',
                        activeTab === tag.id
                          ? 'bg-white/20'
                          : 'hover:bg-white/10'
                      )}
                    >
                      <div className="w-5 h-5 rounded-[25%]" style={{ backgroundColor: tag.color }}></div>
                    
                      <span>{tag.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
      <AddListDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddList}
      />
    </>
  );
} 