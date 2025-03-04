import { SignIn } from "@clerk/nextjs";

// Sign in page
export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
      <div className="w-full max-w-md flex items-center justify-center flex-col">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to Taskly</h1>
          <p className="text-white/80">Sign in to manage your tasks efficiently</p>
        </div>
        <SignIn afterSignInUrl="/" signUpUrl="/sign-up" routing="hash" />
      </div>
    </div>
  );
} 