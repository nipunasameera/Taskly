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
  list_id: string;
  due_date: string;  // Date stored as ISO string
  due_time: string;  // Time stored as string (HH:mm:ss)
  completed: boolean;
  created_at: string;
  updated_at: string;
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