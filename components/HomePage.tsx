import React from 'react';
import { GlobeIcon } from './icons';
import { LiveHealthAlerts } from './LiveHealthAlerts';
import { WaveBackground } from './WaveBackground';

interface HomePageProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onExploreClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onSignUpClick, onAboutClick, onContactClick, onExploreClick }) => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-4 animate-fade-in overflow-hidden">
      <WaveBackground />

      <div className="relative z-10 w-full flex flex-col items-center flex-grow">
          {/* Header */}
          <header className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-end items-center space-x-2 sm:space-x-4">
              <button onClick={onAboutClick} className="text-sm sm:text-base text-slate-600 font-medium hover:text-blue-500 transition-colors">About Us</button>
              <button onClick={onContactClick} className="text-sm sm:text-base text-slate-600 font-medium hover:text-blue-500 transition-colors">Contact</button>
              <button onClick={onLoginClick} className="text-sm sm:text-base text-slate-600 font-medium hover:text-blue-500 transition-colors">Login</button>
              <button onClick={onSignUpClick} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-md transition-all duration-300 text-sm sm:text-base shadow-sm hover:shadow-md">Sign Up</button>
          </header>

          {/* Main Content */}
          <main className="w-full flex-grow flex flex-col items-center text-center">
            {/* Hero Section */}
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-center py-16 sm:py-24 animate-fade-in-up">
                  <div className="flex items-center justify-center gap-4">
                      <GlobeIcon className="w-16 h-16 text-blue-500" />
                      <h1 className="text-5xl md:text-7xl font-bold text-slate-800 tracking-tight">
                          GeoSick
                      </h1>
                  </div>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                      Explore the globe, uncover hidden environmental risks, and protect communities with AI-powered health insights.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                          onClick={onExploreClick}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                          aria-label="Start exploring the globe"
                      >
                          <GlobeIcon className="w-6 h-6 mr-3" />
                          Explore Now
                      </button>
                      <p className="text-slate-500 text-sm">
                          <button onClick={onLoginClick} className="font-semibold text-blue-500 hover:underline">Login</button> or <button onClick={onSignUpClick} className="font-semibold text-blue-500 hover:underline">Sign Up</button> for the full experience.
                      </p>
                  </div>
            </div>

            {/* Live Alerts Section */}
            <LiveHealthAlerts />

          </main>
      </div>
    </div>
  );
};