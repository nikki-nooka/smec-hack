import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const ReportSkeleton: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 animate-pulse w-full h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="h-7 bg-slate-200 rounded w-1/3"></div>
                <LoadingSpinner />
            </div>

            <div className="h-40 bg-slate-200 rounded w-full mb-6"></div>
            
            <div className="space-y-6">
                <div>
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-10 bg-slate-200 rounded w-full"></div>
                        <div className="h-10 bg-slate-200 rounded w-4/5"></div>
                    </div>
                </div>
                 <div>
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-14 bg-slate-200 rounded w-full"></div>
                        <div className="h-14 bg-slate-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};