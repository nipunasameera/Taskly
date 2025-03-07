import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Don't persist the Supabase session since we're using Clerk
  }
});

export interface Todo {
  id: string;
  owner_id: string;  // Clerk user ID (text format)
  text: string;
  list_name: string;
  list_id: string;
  due_date: string;  // Date stored as ISO string
  due_time: string;  // Time stored as string (HH:mm:ss)
  completed: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface List {
  id: string;
  owner_id: string;  // Clerk user ID (text format)
  name: string;
  created_at: string;
  icon: string;
}

export async function addTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) {
  console.log('Adding todo with data:', todo);
  
  try {
    // Validate owner_id
    if (!todo.owner_id) {
      throw new Error('Owner ID is required');
    }

    const formattedTodo = {
      ...todo,
      due_date: new Date(todo.due_date).toISOString().split('T')[0],
      due_time: todo.due_time + ':00'  // Ensure time has seconds
    };
    
    console.log('Formatted todo data:', formattedTodo);

    const { data, error } = await supabase
      .from('todos')
      .insert([formattedTodo])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to add todo: ${error.message}`);
    }

    console.log('Successfully added todo:', data);
    return data;
  } catch (error) {
    console.error('Error in addTodo:', error);
    throw error;
  }
}

export async function addList(list: Omit<List, 'id' | 'created_at'>) {
  console.log('Adding list with data:', list);
  
  try {
    // Validate owner_id
    if (!list.owner_id) {
      throw new Error('Owner ID is required');
    }
    
    //console.log('Formatted todo data:', formattedTodo);

    const { data, error } = await supabase
      .from('lists')
      .insert([list])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to add list: ${error.message}`);
    }

    console.log('Successfully added list:', data);
    return data;
  } catch (error) {
    console.error('Error in addList:', error);
    throw error;
  }
}

export async function getTodos(owner_id: string) {
  console.log('Fetching todos for owner:', owner_id);
  
  try {
    // Validate owner_id
    if (!owner_id) {
      throw new Error('Owner ID is required');
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('owner_id', owner_id)
      .order('due_date', { ascending: true })
      .order('due_time', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch todos: ${error.message}`);
    }

    console.log('Successfully fetched todos:', data);
    return data || [];  // Return empty array if no todos found
  } catch (error) {
    console.error('Error in getTodos:', error);
    throw error;
  }
}

export async function getLists(owner_id: string) {
  console.log('Fetching lists for owner:', owner_id);
  
  try {
    // Validate owner_id
    if (!owner_id) {
      throw new Error('Owner ID is required');
    }

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('owner_id', owner_id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch lists: ${error.message}`);
    }

    console.log('Successfully fetched lists:', data);
    return data || [];  // Return empty array if no lists found
  } catch (error) {
    console.error('Error in getLists:', error);
    throw error;
  }
}

export async function getListByName(owner_id: string, list_name: string) {
  console.log('Fetching lists for owner:', owner_id);
  
  try {
    // Validate owner_id
    if (!owner_id) {
      throw new Error('Owner ID is required');
    }

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('owner_id', owner_id)
      .eq('name', list_name)
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch lists: ${error.message}`);
    }

    console.log('Successfully fetched lists:', data);
    return data[0] || null;  // Return null if no list found
  } catch (error) {
    console.error('Error in getLists:', error);
    throw error;
  }
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
  console.log('Updating todo:', id, 'with updates:', updates);
  
  try {
    // Validate id
    if (!id) {
      throw new Error('Todo ID is required');
    }

    const formattedUpdates = {
      ...updates,
      ...(updates.due_date && {
        due_date: new Date(updates.due_date).toISOString().split('T')[0]
      }),
      ...(updates.due_time && {
        due_time: updates.due_time.includes(':') ? updates.due_time : updates.due_time + ':00'
      })
    };

    console.log('Formatted updates:', formattedUpdates);

    const { data, error } = await supabase
      .from('todos')
      .update(formattedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to update todo: ${error.message}`);
    }

    console.log('Successfully updated todo:', data);
    return data;
  } catch (error) {
    console.error('Error in updateTodo:', error);
    throw error;
  }
}

export async function deleteTodo(id: string) {
  console.log('Deleting todo:', id);
  
  try {
    // Validate id
    if (!id) {
      throw new Error('Todo ID is required');
    }

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to delete todo: ${error.message}`);
    }

    console.log('Successfully deleted todo:', id);
  } catch (error) {
    console.error('Error in deleteTodo:', error);
    throw error;
  }
} 

export async function deleteList(id: string) {
  console.log('Deleting list:', id);
  
  try {
    // Validate id
    if (!id) {
      throw new Error('Todo ID is required');
    }

    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to delete list: ${error.message}`);
    }

    console.log('Successfully deleted list:', id);
  } catch (error) {
    console.error('Error in deleteList:', error);
    throw error;
  }
} 