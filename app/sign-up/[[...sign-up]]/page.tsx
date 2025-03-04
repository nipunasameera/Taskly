import { SignUp } from "@clerk/nextjs";

// Sign up page
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join Taskly</h1>
          <p className="text-white/80">Create your account to get started</p>
        </div>
        <SignUp afterSignUpUrl="/" signInUrl="/auth" routing="hash" />
      </div>
    </div>
  );
} 