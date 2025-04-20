'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side - Welcome content */}
        <div className="text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Finansınızı <br />
            <span className="text-blue-400">Akıllıca</span> Yönetin
          </h1>
          <p className="text-xl text-gray-300">
            Cebim ile gelir ve giderlerinizi kolayca takip edin, 
            hedeflerinizi belirleyin ve finansal geleceğinizi planlayın.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Gelir ve gider takibi</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Kategori bazlı analiz</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Finansal hedef belirleme</span>
            </div>
          </div>
        </div>

        {/* Right side - Login card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo-no-background.png"
                alt="Logo"
                width={150}
                height={50}
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Cebim'e Hoş Geldiniz
            </h2>
            <p className="text-gray-300">
              Finansınızı kolayca yönetin
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard/income' })}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg bg-white text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google ile Giriş Yap</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Giriş yaparak{" "}
              <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                Kullanım Koşulları
              </a>{" "}
              ve{" "}
              <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                Gizlilik Politikası
              </a>{" "}
              &apos;nı kabul etmiş olursunuz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 