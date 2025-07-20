

import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { ReportSkeleton } from './ReportSkeleton';
import { analyzePrescription } from '../services/geminiService';
import type { PrescriptionAnalysisResult } from '../types';
import { ArrowLeftIcon, ClipboardListIcon, ScanIcon, CloseIcon } from './icons';
import { PrescriptionReport } from './PrescriptionReport';

interface PrescriptionAnalysisPageProps {
  onBack: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const PrescriptionAnalysisPage: React.FC<PrescriptionAnalysisPageProps> = ({ onBack }) => {
  const [analysis, setAnalysis] = useState<PrescriptionAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
        setImagePreview(null);
    }
  }, [imageFile]);


  const handleAnalyze = async () => {
    if (!imageFile || !imagePreview) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const imageData = await fileToBase64(imageFile);
      const result = await analyzePrescription(imageData);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the prescription. The AI model may be unavailable, the content was blocked, or the image was unreadable. Please try another image.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearImage = () => {
      setImageFile(null);
      setAnalysis(null);
      setError(null);
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center animate-fade-in">
        <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-slate-700 font-semibold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white z-10"
            aria-label="Back to Welcome Page"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
        </button>

        <header className="text-center w-full max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-3">
                <ClipboardListIcon className="w-10 h-10 text-green-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
                    Prescription Analysis
                </h1>
            </div>
            <p className="mt-3 text-base text-slate-600">
                Upload a doctor's prescription to get a clear, easy-to-understand summary and find nearby pharmacies.
            </p>
        </header>

        <main className="w-full max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="animate-fade-in-up">
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 h-full flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Upload Prescription Image</h2>
                    <div className="flex-grow aspect-video relative">
                        {imagePreview ? (
                            <div className="w-full h-full">
                                <img src={imagePreview} alt="Selected prescription preview" className="w-full h-full object-contain rounded-md" />
                                 {!isLoading && (
                                     <button onClick={clearImage} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors">
                                        <CloseIcon className="w-5 h-5" />
                                     </button>
                                )}
                            </div>
                        ) : (
                            <ImageUploader onFileSelect={setImageFile} disabled={isLoading} />
                        )}
                    </div>
                     <button
                        onClick={handleAnalyze}
                        disabled={!imageFile || isLoading}
                        className="w-full mt-6 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200"
                    >
                        <ScanIcon className="w-5 h-5 mr-2" />
                        {isLoading ? 'Analyzing...' : 'Analyze Prescription'}
                    </button>
                </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                {isLoading ? (
                    <ReportSkeleton />
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Analysis Error</p>
                        <p>{error}</p>
                    </div>
                ) : analysis ? (
                    <PrescriptionReport result={analysis} imageUrl={imagePreview} />
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 h-full flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                           <ClipboardListIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Awaiting Prescription</h2>
                        <p className="text-slate-500 mt-1">Upload an image of your prescription to see the details here.</p>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};