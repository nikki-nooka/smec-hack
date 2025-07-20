import React, { useState, useEffect, Suspense, lazy } from 'react';
import { MapPinIcon, BrainCircuitIcon, DocumentChartBarIcon } from './icons';

const RotatingGlobe = lazy(() => import('./RotatingGlobe').then(module => ({ default: module.RotatingGlobe })));

const steps = [
    {
        icon: MapPinIcon,
        title: "Pinpoint a Location",
        description: "Initiate an analysis by selecting any point on our interactive 3D globe. Our platform targets the precise coordinates for deep environmental assessment.",
    },
    {
        icon: BrainCircuitIcon,
        title: "AI-Powered Analysis",
        description: "Our proprietary analysis engine, powered by Google's Gemini models, processes vast datasets—including climatological and geographical information—to identify potential health hazards with high accuracy.",
    },
    {
        icon: DocumentChartBarIcon,
        title: "Receive an Intelligence Briefing",
        description: "Instantly receive a structured report detailing probable hazards, correlating them with potential diseases, and providing a clear protocol of actionable preventative measures.",
    },
];

const VisualPanel: React.FC<{ activeStep: number }> = ({ activeStep }) => {
    // A simple helper to contain the visual for each step
    const StepVisual: React.FC<{ children: React.ReactNode; index: number; activeStep: number }> = ({ children, index, activeStep }) => (
        <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeStep === index ? 'opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    );

    return (
        <div className="relative w-full h-80 lg:h-full bg-gradient-to-br from-blue-700 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <StepVisual index={0} activeStep={activeStep}>
                <div className="w-full h-full flex items-center justify-center relative">
                    <Suspense fallback={null}>
                        <div className="absolute inset-0 z-0 opacity-80">
                            <RotatingGlobe />
                        </div>
                    </Suspense>
                    <MapPinIcon className="w-16 h-16 text-white z-10 drop-shadow-lg animate-pulse" style={{ animationDuration: '2s' }}/>
                </div>
            </StepVisual>
             <StepVisual index={1} activeStep={activeStep}>
                 <div className="w-full h-full flex items-center justify-center">
                    <BrainCircuitIcon className="w-24 h-24 text-blue-300 animate-pulse" style={{ animationDuration: '3s' }} />
                 </div>
            </StepVisual>
             <StepVisual index={2} activeStep={activeStep}>
                 <div className="w-full h-full flex items-center justify-center p-8">
                    <DocumentChartBarIcon className="w-24 h-24 text-blue-300" />
                 </div>
            </StepVisual>
        </div>
    );
};


export const InteractiveHowItWorks: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep(prev => (prev + 1) % steps.length);
        }, 5000); // Change step every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Steps */}
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const isActive = index === activeStep;
                    const Icon = step.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => setActiveStep(index)}
                            className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${isActive ? 'bg-white border-blue-500 shadow-lg scale-105' : 'bg-white/60 border-transparent hover:bg-white hover:border-blue-300'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`font-bold transition-colors ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>{step.title}</h3>
                                </div>
                            </div>
                            <p className={`mt-3 text-sm transition-colors ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                                {step.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Right: Visuals */}
            <div className="w-full min-h-[320px] lg:min-h-full">
                <VisualPanel activeStep={activeStep} />
            </div>
        </div>
    );
};