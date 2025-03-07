'use client'

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { initializeUserLists } from '../lib/actions';

export default function InitializeDefaultLists( ) {
  const { user, isLoaded } = useUser();
  
  useEffect(() => {
    const initializeDefaultLists = async () => {
      if (!user?.id) return;

      try {
        await initializeUserLists(user.id);
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    };

    if (isLoaded && user) {
      initializeDefaultLists();
    }
  }, [user, isLoaded]);

  // This component doesn't render anything
  return null;
} 