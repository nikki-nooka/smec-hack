import React from 'react';
import { GlobeIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="text-center w-full max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-3">
                <GlobeIcon className="w-10 h-10 text-blue-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
                    GeoSick
                </h1>
            </div>
            <p className="mt-3 text-base text-slate-600">
                AI-Powered Environmental Health Analysis. Upload an image to detect risks and protect your community.
            </p>
        </header>
    );
};