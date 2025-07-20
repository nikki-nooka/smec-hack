
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface HealthForecastSkeletonProps {
    status: 'locating' | 'fetching';
}

export const HealthForecastSkeleton: React.FC<HealthForecastSkeletonProps> = ({ status }) => {
    const message = status === 'locating' 
        ? "Getting your current location..."
        : "Our AI is preparing your briefing...";

    return (
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-center animate-pulse">
            <div className="flex justify-center items-center mb-4">
                <LoadingSpinner />
            </div>
            <h2 className="text-2xl font-bold text-slate-700">{message}</h2>
            <p className="text-slate-500 mt-2">This will just take a moment.</p>

            <div className="mt-8 space-y-4">
                <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
                <div className="h-20 bg-slate-200 rounded-lg w-full"></div>
                <div className="h-20 bg-slate-200 rounded-lg w-full"></div>
            </div>
        </div>
    );
};
