
import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { WelcomePage } from './components/WelcomePage';
import { GlobePage } from './components/GlobePage';
import { AuthPage } from './components/AuthPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { ChatBot } from './components/ChatBot';
import { ImageAnalysisPage } from './components/ImageAnalysisPage';
import { CheckupPage } from './components/CheckupPage';
import { PrescriptionAnalysisPage } from './components/PrescriptionAnalysisPage';
import { IntroAnimation } from './components/IntroAnimation';
import type { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact' | 'explore' | 'welcome' | 'image-analysis' | 'checkup' | 'prescription-analysis'>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('geoSickUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('geoSickUser');
    }
  }, []);

  const handleAuthSuccess = (newUser: User) => {
    localStorage.setItem('geoSickUser', JSON.stringify(newUser));
    setUser(newUser);
    setShowAuth(false);
    setCurrentPage('welcome');
  };

  const handleLogout = () => {
    localStorage.removeItem('geoSickUser');
    setUser(null);
    setCurrentPage('home');
  };
  
  const handleOpenLogin = () => {
      setAuthMode('login');
      setShowAuth(true);
  }
  
  const handleOpenSignUp = () => {
      setAuthMode('signup');
      setShowAuth(true);
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
        case 'explore':
            return <GlobePage onBack={() => setCurrentPage(user ? 'welcome' : 'home')} />;
        case 'about':
            return <AboutPage onBack={() => setCurrentPage('home')} />;
        case 'contact':
            return <ContactPage onBack={() => setCurrentPage('home')} />;
        case 'image-analysis':
            return <ImageAnalysisPage onBack={() => setCurrentPage('welcome')} onScheduleCheckup={() => setCurrentPage('checkup')} />;
        case 'checkup':
            return <CheckupPage onBack={() => setCurrentPage('image-analysis')} />;
        case 'prescription-analysis':
            return <PrescriptionAnalysisPage onBack={() => setCurrentPage('welcome')} />;
        case 'welcome':
            if (user) {
                return <WelcomePage user={user} onAnalyze={() => setCurrentPage('image-analysis')} onLogout={handleLogout} onAnalyzePrescription={() => setCurrentPage('prescription-analysis')} />;
            }
            // If user is null, fall through to home.
        case 'home':
        default:
            if (user) {
                 // If a logged-in user somehow gets to 'home', show 'welcome' instead.
                return <WelcomePage user={user} onAnalyze={() => setCurrentPage('image-analysis')} onLogout={handleLogout} onAnalyzePrescription={() => setCurrentPage('prescription-analysis')}/>;
            }
            return <HomePage
                onLoginClick={handleOpenLogin}
                onSignUpClick={handleOpenSignUp}
                onAboutClick={() => setCurrentPage('about')}
                onContactClick={() => setCurrentPage('contact')}
                onExploreClick={() => setCurrentPage('explore')}
            />;
    }
  }
  
  if (showIntro) {
      return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
        <div className="animate-fade-in">
            {renderCurrentPage()}
            {showAuth && (
                <AuthPage 
                    mode={authMode}
                    onClose={() => setShowAuth(false)}
                    onSwitchMode={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')}
                    onAuthSuccess={handleAuthSuccess}
                />
            )}
            <ChatBot />
        </div>
    </div>
  );
}