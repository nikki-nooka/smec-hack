

import React, { useState } from 'react';
import type { User } from '../types';
import { GlobeIcon, LogoutIcon, ScanIcon, ClipboardListIcon, NewspaperIcon } from './icons';
import { HealthForecast } from './HealthForecast';

interface WelcomePageProps {
  user: User;
  onAnalyze: () => void;
  onLogout: () => void;
  onAnalyzePrescription: () => void;
}

type View = 'actions' | 'briefing';

export const WelcomePage: React.FC<WelcomePageProps> = ({ user, onAnalyze, onLogout, onAnalyzePrescription }) => {
  const [view, setView] = useState<View>('actions');

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in relative overflow-hidden bg-slate-50">
        {/* Background */}
        <div
            className="absolute inset-0 z-0 opacity-[0.08] mix-blend-multiply"
            style={{
                backgroundImage: `url(//unpkg.com/three-globe/example/img/earth-topology.png)`,
                backgroundSize: '1000px',
                animation: 'endless-scroll 200s linear infinite',
            }}
        ></div>

        <button 
            onClick={onLogout}
            className="absolute top-6 right-6 bg-white/70 backdrop-blur-md text-slate-700 font-semibold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white z-20"
        >
            <LogoutIcon className="w-5 h-5 mr-2" />
            Logout
        </button>

        <main className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-center items-center text-center z-10">
            {view === 'actions' ? (
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-4">
                        <GlobeIcon className="w-16 h-16 text-blue-500" />
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 tracking-tight">
                            GeoSick
                        </h1>
                    </div>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-700">
                        Welcome, <span className="font-bold text-blue-600">{user.nickname}</span>!
                    </p>
                    <p className="mt-2 max-w-2xl mx-auto text-lg text-slate-600">
                        Ready to investigate environmental health risks?
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onAnalyze}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                            aria-label="Analyze an environmental image"
                        >
                            <ScanIcon className="w-6 h-6 mr-3" />
                            Analyze Image
                        </button>
                         <button
                            onClick={onAnalyzePrescription}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
                            aria-label="Analyze a doctor's prescription"
                        >
                            <ClipboardListIcon className="w-6 h-6 mr-3" />
                            Analyze Prescription
                        </button>
                         <button
                            onClick={() => setView('briefing')}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                            aria-label="Get your daily health briefing"
                        >
                            <NewspaperIcon className="w-6 h-6 mr-3" />
                            Daily Health Briefing
                        </button>
                    </div>
                </div>
            ) : (
                <HealthForecast onBack={() => setView('actions')} />
            )}
        </main>
    </div>
  );
};