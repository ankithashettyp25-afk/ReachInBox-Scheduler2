import React from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // Real OAuth flow or direct redirect to dashboard simulation for token setup
    localStorage.setItem('user', JSON.stringify({
      name: 'Oliver Brown',
      email: 'oliver.brown@domain.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
    }));
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Login</h1>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Login with Google
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">or sign up through email</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }} className="space-y-4 text-left">
          <div>
            <input 
              type="email" 
              placeholder="Focal ID" 
              required 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              required 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition shadow"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}