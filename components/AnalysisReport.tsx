import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { HazardIcon, DiseaseIcon, PrecautionIcon, ChevronDownIcon, SummaryIcon } from './icons';

interface AnalysisReportProps {
  result: AnalysisResult;
  imageUrl: string | null;
}

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-700 bg-slate-50/50 hover:bg-slate-100/70 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <DiseaseIcon className="w-6 h-6 text-amber-500"/>
                    <span className="text-base">{title}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-4 text-slate-600 border-t border-slate-200">
                         {children}
                    </div>
                </div>
            </div>
        </div>
    );
};


export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, imageUrl }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        {imageUrl && <img src={imageUrl} alt="Analyzed" className="rounded-lg w-full max-h-72 object-cover border border-slate-200" />}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
             <div className="flex items-start">
                <SummaryIcon className="w-6 h-6 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-base text-blue-800">Overall Assessment</h3>
                    <p className="mt-1 text-sm text-blue-700">{result.summary}</p>
                </div>
            </div>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><HazardIcon className="w-6 h-6 text-rose-500"/>Identified Hazards</h3>
                <div className="space-y-2">
                    {result.hazards.map((h, index) => (
                        <div key={index} className="bg-rose-50/70 p-3 rounded-md border-l-4 border-rose-500 flex items-start gap-3">
                           <strong className="font-semibold text-sm text-rose-800">{h.hazard}:</strong> 
                           <span className="text-sm text-rose-700">{h.description}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div>
                 <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><DiseaseIcon className="w-6 h-6 text-amber-500"/>Potential Diseases & Precautions</h3>
                <div className="space-y-3">
                     {result.diseases.map((d, index) => (
                        <AccordionItem 
                            key={index} 
                            title={d.name}
                            defaultOpen={index === 0}
                        >
                            <p className="mb-4 text-sm"><strong className="font-medium text-slate-700">Cause:</strong> {d.cause}</p>
                            <div>
                                <h5 className="font-semibold mb-2 flex items-center text-slate-700 text-sm gap-2"><PrecautionIcon className="w-5 h-5 text-green-500"/>Precautions:</h5>
                                <ul className="space-y-2 pl-4 text-sm">
                                    {d.precautions.map((p, pIndex) => (
                                        <li key={pIndex} className="flex items-start gap-2.5">
                                           <span className="text-green-500 mt-1">&#10003;</span> 
                                           <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AccordionItem>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};