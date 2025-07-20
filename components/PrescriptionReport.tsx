
import React, { useState } from 'react';
import type { PrescriptionAnalysisResult, Facility } from '../types';
import { findFacilitiesByCoordinates } from '../services/geminiService';
import { PrecautionIcon, SummaryIcon, BuildingOfficeIcon, DirectionsIcon, CrosshairsIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';

interface PrescriptionReportProps {
  result: PrescriptionAnalysisResult;
  imageUrl: string;
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

export const PrescriptionReport: React.FC<PrescriptionReportProps> = ({ result, imageUrl }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [findStatus, setFindStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [findError, setFindError] = useState<string | null>(null);

  const handleFindFacilities = async () => {
    setFindStatus('loading');
    setFacilities([]);
    setFindError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
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
      },
      (error) => {
        console.error("Geolocation error:", error);
        setFindError("Could not get your location. Please enable location services in your browser.");
        setFindStatus('error');
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-6 animate-fade-in">
        <img src={imageUrl} alt="Uploaded Prescription" className="rounded-lg w-full max-h-72 object-contain border border-slate-200 mb-6" />

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
             <div className="flex items-start">
                <SummaryIcon className="w-6 h-6 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-base text-blue-800">Prescription Summary</h3>
                    <p className="mt-1 text-sm text-blue-700">{result.summary}</p>
                </div>
            </div>
        </div>

        {/* Medicines */}
        <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Prescribed Medicines</h3>
            <div className="space-y-2">
                {result.medicines.map((med, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-md border-l-4 border-blue-500">
                       <p className="font-semibold text-sm text-blue-800">{med.name}</p>
                       <p className="text-sm text-slate-600">{med.dosage}</p>
                    </div>
                ))}
                {result.medicines.length === 0 && (
                    <p className="text-sm text-slate-500">No specific medicines were clearly identified.</p>
                )}
            </div>
        </div>
        
        {/* Precautions */}
        <div className="mb-6">
             <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><PrecautionIcon className="w-6 h-6 text-green-500"/>Precautions & Instructions</h3>
            <ul className="space-y-2 pl-2 text-sm text-slate-700">
                {result.precautions.map((p, pIndex) => (
                    <li key={pIndex} className="flex items-start gap-2.5">
                       <span className="text-green-500 mt-1">&#10003;</span> 
                       <span>{p}</span>
                    </li>
                ))}
                 {result.precautions.length === 0 && (
                    <p className="text-sm text-slate-500">No specific precautions were clearly identified.</p>
                )}
            </ul>
        </div>
        
        {/* Nearby Facilities */}
        <div className="border-t border-slate-200 pt-6 mt-6">
             <h3 className="text-lg font-bold text-slate-800 mb-3">Find Nearby Medical Facilities</h3>

            {findStatus === 'idle' && (
                <button
                    onClick={handleFindFacilities}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-all"
                >
                    <CrosshairsIcon className="w-5 h-5 mr-2" />
                    Use My Location to Find Pharmacies & Hospitals
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
                                Search Again
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