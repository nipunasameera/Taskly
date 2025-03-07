'use server'

import { getLists, addList } from './supabase'

export async function initializeUserLists(userId: string) {
  const defaultLists = [
    { name: 'Personal', icon: 'personal' },
    { name: 'Work', icon: 'work' }
  ];

  try {
    // Check if user already has lists
    const existingLists = await getLists(userId);
    
    // If user has no lists, add default lists
    if (existingLists.length === 0) {
      console.log('Initializing default lists for new user');
      
      // Add default lists sequentially
      for (const list of defaultLists) {
        await addList({
          owner_id: userId,
          name: list.name,
          icon: list.icon
        });
      }

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
} 