import React, { useState } from 'react';
import type { LocationAnalysisResult, Facility } from '../types';
import { findFacilitiesByCoordinates } from '../services/geminiService';
import { HazardIcon, DiseaseIcon, PrecautionIcon, ChevronDownIcon, SummaryIcon, MapPinIcon, BuildingOfficeIcon, DirectionsIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';

interface LocationReportProps {
  result: LocationAnalysisResult;
  imageUrl: string;
  coords: { lat: number; lng: number };
}

const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const rlat1 = lat1 * (Math.PI / 180);
    const rlat2 = lat2 * (Math.PI / 180);
    const difflat = rlat2 - rlat1;
    const difflon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
        Math.cos(rlat1) * Math.cos(rlat2) *
        Math.sin(difflon / 2) * Math.sin(difflon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-700 bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                aria-expanded={isOpen}
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

export const LocationReport: React.FC<LocationReportProps> = ({ result, imageUrl, coords }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [findStatus, setFindStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [findError, setFindError] = useState<string | null>(null);

  const handleFindFacilities = async () => {
    if (!coords) return;
    setFindStatus('loading');
    setFacilities([]);
    setFindError(null);
    try {
        const facilitiesFromApi = await findFacilitiesByCoordinates(coords);

        const nearbyFacilities = facilitiesFromApi
            .map(facility => ({
                ...facility,
                distance: getDistanceInKm(coords.lat, coords.lng, facility.lat, facility.lng)
            }))
            .sort((a, b) => a.distance - b.distance)
            .map(f => ({
                ...f,
                distance: `${f.distance.toFixed(1)} km`
            }));
        
        setFacilities(nearbyFacilities);
        setFindStatus('success');
    } catch (error) {
        console.error("Facility finding error:", error);
        setFindError("Could not find facilities. The AI model might be busy or unavailable.");
        setFindStatus('error');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
        <div className="space-y-4">
            <img src={imageUrl} alt={`Satellite view of ${result.locationName}`} className="rounded-lg w-full aspect-video object-cover border border-slate-200" />
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <MapPinIcon className="w-7 h-7 text-blue-500"/> 
                {result.locationName}
            </h3>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
             <div className="flex items-start">
                <SummaryIcon className="w-6 h-6 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-base text-blue-800">Overall Assessment</h4>
                    <p className="mt-1 text-sm text-blue-700">{result.summary}</p>
                </div>
            </div>
        </div>
        
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><HazardIcon className="w-6 h-6 text-rose-500"/>Identified Hazards</h4>
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
                 <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><DiseaseIcon className="w-6 h-6 text-amber-500"/>Potential Diseases & Precautions</h4>
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
        <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="flex items-center gap-3">
                <BuildingOfficeIcon className="w-8 h-8 text-blue-500"/>
                <div>
                    <h4 className="text-lg font-bold text-slate-800">Nearby Health Resources</h4>
                    <p className="text-slate-500 text-sm">Find facilities near this location</p>
                </div>
            </div>

            {findStatus === 'idle' && (
                <button
                    onClick={handleFindFacilities}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-all"
                >
                    Find Nearby Facilities
                </button>
            )}

            <div className="mt-4">
                {findStatus === 'loading' && <div className="flex items-center justify-center text-slate-600"><LoadingSpinner /><span className="ml-3">Finding nearby facilities...</span></div>}
                {findStatus === 'error' && (
                    <div className="text-center p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-red-600">{findError}</p>
                        <button onClick={handleFindFacilities} className="text-sm mt-2 text-red-700 font-semibold hover:underline">Try Again</button>
                    </div>
                )}
                
                {findStatus === 'success' && (
                    facilities.length > 0 ? (
                        <div className="space-y-3 animate-fade-in">
                            <h3 className="font-semibold text-slate-700">Nearest Facilities Found ({facilities.length}):</h3>
                            <ul className="divide-y divide-slate-200 border rounded-md max-h-64 overflow-y-auto">
                                {facilities.map((facility, index) => {
                                    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
                                    return (
                                    <li key={index} className="p-3 flex justify-between items-center bg-white">
                                        <div>
                                            <p className="font-medium text-slate-800">{facility.name}</p>
                                            <p className="text-sm text-slate-500">{facility.type} - {facility.distance}</p>
                                        </div>
                                        <a 
                                            href={directionsUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-3 rounded-full flex items-center justify-center text-sm transition-colors"
                                            aria-label={`Get directions to ${facility.name}`}
                                        >
                                            <DirectionsIcon className="w-4 h-4 mr-1.5" />
                                            Directions
                                        </a>
                                    </li>
                                )})}
                            </ul>
                            <button onClick={() => setFindStatus('idle')} className="w-full text-sm mt-3 text-blue-500 hover:underline">
                                Clear Results
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 mt-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 animate-fade-in text-center" role="alert">
                            <p className="font-bold">No Facilities Found</p>
                            <p className="text-sm">Our AI couldn't find any health facilities within a 5km radius.</p>
                            <button onClick={handleFindFacilities} className="text-sm mt-2 text-yellow-800 font-semibold hover:underline">
                                Try Search Again
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    </div>
  );
};