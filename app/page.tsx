import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import TodoList from './components/Todo';

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/auth');
  }

  return <TodoList />;
}
