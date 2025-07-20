import React from 'react';
import { ArrowLeftIcon, GlobeIcon, InfoIcon, ScanIcon } from './icons';

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="w-full max-w-5xl mx-auto py-4 flex justify-start items-center">
            <button 
                onClick={onBack}
                className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:bg-slate-100"
                aria-label="Back to Home"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back
            </button>
        </header>
        
        <main className="flex-grow flex flex-col items-center text-center px-4 py-8">
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in-up">
                    <InfoIcon className="w-12 h-12 text-blue-500" />
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-700 tracking-tight">
                        About GeoSick
                    </h1>
                </div>
                <p className="max-w-3xl mx-auto text-lg text-slate-500 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    GeoSick translates complex environmental data into clear, actionable health intelligence, empowering communities to preemptively address public health threats.
                </p>
                
                <div className="text-left space-y-8 mt-12">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200/60 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-2xl font-bold text-slate-700 mb-3 flex items-center gap-3">
                           <GlobeIcon className="w-8 h-8 text-blue-500" />
                           Our Mission
                        </h2>
                        <p className="text-slate-600">
                            Our core mission is to democratize environmental health intelligence. We provide predictive, location-specific insights to help public health agencies, NGOs, and communities transition from reactive treatment to proactive prevention, mitigating health crises before they begin.
                        </p>
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200/60 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <h2 className="text-3xl font-bold text-slate-700 mb-6 flex items-center gap-3">
                           <ScanIcon className="w-8 h-8 text-blue-500" />
                           How It Works
                        </h2>
                        <ol className="space-y-6">
                            <li className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                <div>
                                    <h3 className="font-bold text-slate-700">Pinpoint a Location</h3>
                                    <p className="text-slate-500 mt-1">Initiate an analysis by selecting any point on our interactive 3D globe. Our platform targets the precise coordinates for deep environmental assessment.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                <div>
                                    <h3 className="font-bold text-slate-700">AI-Powered Analysis</h3>
                                    <p className="text-slate-500 mt-1">Our proprietary analysis engine, powered by Google's Gemini models, processes vast datasets—including climatological and geographical information—to identify potential health hazards with high accuracy.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                <div>
                                    <h3 className="font-bold text-slate-700">Receive an Intelligence Briefing</h3>
                                    <p className="text-slate-500 mt-1">Instantly receive a structured report detailing probable hazards, correlating them with potential diseases, and providing a clear protocol of actionable preventative measures.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </main>
        
        <footer className="w-full text-center p-8 text-slate-400 text-sm">
            GeoSick &copy; {new Date().getFullYear()} - Intelligence for a Healthier Planet.
        </footer>
    </div>
  );
};