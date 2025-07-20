import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { analyzeLocationByCoordinates } from '../services/geminiService';
import type { LocationAnalysisResult } from '../types';
import { LocationReport } from './LocationReport';
import { ArrowLeftIcon, MapPinIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';

const Globe = lazy(() => import('react-globe.gl'));

export const GlobePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [analysis, setAnalysis] = useState<{ result: LocationAnalysisResult, imageUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number, lng: number } | null>(null);

  const handleGlobeClick = useCallback(async ({ lat, lng }: { lat: number, lng: number }) => {
    setIsPanelOpen(true);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setClickedCoords({ lat, lng });

    try {
      const apiResponse = await analyzeLocationByCoordinates(lat, lng);
      setAnalysis({ result: apiResponse.analysis, imageUrl: apiResponse.imageUrl });
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the location. The AI model may be unavailable or the request was blocked. Please try another location.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden animate-fade-in">
       <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-slate-800"><LoadingSpinner/></div>}>
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          onGlobeClick={handleGlobeClick}
          atmosphereColor="lightblue"
          atmosphereAltitude={0.25}
          width={window.innerWidth}
          height={window.innerHeight}
        />
       </Suspense>

      <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white/80 backdrop-blur-md shadow-2xl transition-transform duration-500 ease-in-out transform ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Location Analysis</h2>
                <button onClick={() => setIsPanelOpen(false)} className="p-2 rounded-full hover:bg-slate-200">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-slate-600 font-semibold">Analyzing Location...</p>
                        <p className="mt-1 text-sm text-slate-500">Generating report and satellite image.</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 m-4" role="alert">
                        <p className="font-bold">Analysis Error</p>
                        <p>{error}</p>
                    </div>
                )}
                {analysis && clickedCoords && <LocationReport result={analysis.result} imageUrl={analysis.imageUrl} coords={clickedCoords} />}
            </div>
        </div>
      </div>

      <div className={`absolute top-1/2 -translate-y-1/2 left-4 p-4 animate-fade-in-up transition-opacity duration-500 ${isPanelOpen ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg text-center">
              <MapPinIcon className="w-12 h-12 mx-auto text-blue-500 mb-2"/>
              <h2 className="text-xl font-bold text-slate-800">Explore the Globe</h2>
              <p className="text-slate-600 mt-1">Click anywhere on the Earth to begin analysis.</p>
          </div>
      </div>
      
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-slate-700 font-semibold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white"
        aria-label="Back to Welcome Page"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back
      </button>
    </div>
  );
};