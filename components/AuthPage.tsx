
import React, { useState, Suspense } from 'react';
import type { User } from '../types';
import { CloseIcon, UserIcon, LockClosedIcon, GlobeIcon } from './icons';
import { RotatingGlobe } from './RotatingGlobe';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  onSwitchMode: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode, onClose, onAuthSuccess, onSwitchMode }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length < 3) {
      setError('Nickname must be at least 3 characters long.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    
    // This is a simulation. In a real app, this logic would be on a secure backend.
    if (mode === 'signup') {
        if (localStorage.getItem(`user_${nickname}`)) {
            setError('This nickname is already taken. Please choose another.');
            return;
        }
        localStorage.setItem(`user_${nickname}`, password);
    } else { // login mode
        const storedPassword = localStorage.getItem(`user_${nickname}`);
        if (!storedPassword || storedPassword !== password) {
            setError('Invalid nickname or password.');
            return;
        }
    }
    setError('');
    onAuthSuccess({ nickname });
  };

  const title = mode === 'login' ? 'Welcome Back' : 'Create Your Account';
  const subtitle = mode === 'login' ? 'Log in to access your dashboard.' : 'Join to start protecting communities.';
  const buttonText = mode === 'login' ? 'Login Securely' : 'Create Account';
  const switchText = mode === 'login' ? "Don't have an account?" : 'Already have an account?';
  const switchLinkText = mode === 'login' ? 'Sign Up' : 'Login';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl grid lg:grid-cols-2 animate-fade-in-up overflow-hidden">
        
        {/* Left Visual Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-600 to-slate-800 text-white relative">
            <div className="absolute inset-0 z-0 h-full w-full">
               <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><GlobeIcon className="w-24 h-24 text-blue-400/50 animate-spin"/></div>}>
                <RotatingGlobe />
               </Suspense>
            </div>
            <div className="z-10 text-center">
                <GlobeIcon className="w-20 h-20 text-white mx-auto mb-4"/>
                <h2 className="text-3xl font-bold">GeoSick</h2>
                <p className="mt-2 text-blue-200">AI-Powered Environmental Health Intelligence.</p>
            </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-12 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close authentication">
                <CloseIcon className="w-6 h-6" />
            </button>
            
            <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
                <p className="text-slate-500 mt-1">{subtitle}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="nickname" className="sr-only">Nickname</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            id="nickname"
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                            className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Your Nickname"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="password"className="sr-only">Password</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Password"
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600 text-center pt-1">{error}</p>}
                
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {buttonText}
                </button>
            </form>

            <div className="text-center mt-8">
                <p className="text-sm text-slate-500">
                  {switchText}{' '}
                  <button onClick={onSwitchMode} className="font-semibold text-blue-500 hover:underline">
                    {switchLinkText}
                  </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
