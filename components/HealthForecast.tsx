

import React, { useState, useEffect } from 'react';
import { getHealthForecast } from '../services/geminiService';
import type { HealthForecast as HealthForecastData } from '../types';
import { HealthForecastSkeleton } from './HealthForecastSkeleton';
import { ArrowLeftIcon, NewspaperIcon, ShieldCheckIcon, HazardIcon, SunIcon, WindIcon } from './icons';

interface HealthForecastProps {
    onBack: () => void;
}

type Status = 'idle' | 'locating' | 'fetching' | 'success' | 'error';

const RiskLevelIndicator: React.FC<{ level: 'Low' | 'Moderate' | 'High' | 'Very High' }> = ({ level }) => {
    const levelStyles = {
        'Low': { color: 'bg-green-500', text: 'Low' },
        'Moderate': { color: 'bg-yellow-500', text: 'Moderate' },
        'High': { color: 'bg-orange-500', text: 'High' },
        'Very High': { color: 'bg-red-500', text: 'Very High' },
    };
    const style = levelStyles[level] || levelStyles['Low'];
    return (
        <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${style.color}`}>
            {style.text}
        </span>
    );
};

const RiskIcon: React.FC<{ name: string }> = ({ name }) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('air') || lowerCaseName.includes('pollen')) {
        return <WindIcon className="w-6 h-6 text-slate-500" />;
    }
    if (lowerCaseName.includes('uv') || lowerCaseName.includes('heat')) {
        return <SunIcon className="w-6 h-6 text-orange-500" />;
    }
    return <HazardIcon className="w-6 h-6 text-red-500" />;
};

export const HealthForecast: React.FC<HealthForecastProps> = ({ onBack }) => {
    const [status, setStatus] = useState<Status>('idle');
    const [forecast, setForecast] = useState<HealthForecastData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchForecast = () => {
        setStatus('locating');
        setError(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                setStatus('fetching');
                const { latitude, longitude } = position.coords;
                try {
                    const result = await getHealthForecast({ lat: latitude, lng: longitude });
                    setForecast(result);
                    setStatus('success');
                } catch (err) {
                    console.error(err);
                    setError("Failed to generate your health briefing. The AI model might be busy. Please try again later.");
                    setStatus('error');
                }
            },
            (geoError) => {
                console.error("Geolocation error:", geoError);
                setError("Could not get your location. Please enable location services in your browser and try again.");
                setStatus('error');
            }
        );
    };

    useEffect(() => {
        fetchForecast();
    }, []);

    if (status === 'locating' || status === 'fetching') {
        return <HealthForecastSkeleton status={status} />;
    }

    if (status === 'error') {
        return (
            <div className="w-full max-w-2xl text-center bg-white p-8 rounded-lg shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
                <p className="text-slate-600 mt-2">{error}</p>
                <div className="mt-6 flex gap-4 justify-center">
                    <button onClick={onBack} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg">Back</button>
                    <button onClick={fetchForecast} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Try Again</button>
                </div>
            </div>
        );
    }
    
    if (status === 'success' && forecast) {
        return (
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200/80 animate-fade-in">
                <div className="p-6 border-b border-slate-200 bg-slate-50/70 rounded-t-xl flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <NewspaperIcon className="w-10 h-10 text-purple-500" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Your Daily Health Briefing</h2>
                            <p className="text-slate-500">{forecast.locationName}</p>
                        </div>
                    </div>
                     <button onClick={onBack} className="bg-white hover:bg-slate-100 text-slate-600 font-semibold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-200" aria-label="Back to main menu">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back
                    </button>
                </div>
                <div className="p-6 space-y-6">
                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800">{forecast.summary}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Today's Key Risk Factors</h3>
                        <div className="space-y-3">
                            {forecast.riskFactors.map(factor => (
                                <div key={factor.name} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mt-1">
                                        <RiskIcon name={factor.name} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-slate-700">{factor.name}</p>
                                            <RiskLevelIndicator level={factor.level} />
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{factor.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                         <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <ShieldCheckIcon className="w-6 h-6 text-green-600"/> Recommended Actions
                         </h3>
                        <ul className="space-y-2 pl-4 text-sm text-slate-700">
                             {forecast.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2.5">
                                   <span className="text-green-500 mt-1">&#10003;</span> 
                                   <span>{rec}</span>
                                </li>
                             ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    return null;
}