'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/main' })}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Image
            src="/google.svg"
            alt="Google Logo"
            width={20}
            height={20}
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
} 