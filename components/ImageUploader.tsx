
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadIcon, CameraIcon } from './icons';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

type Mode = 'upload' | 'camera';

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, disabled }) => {
  const [mode, setMode] = useState<Mode>('upload');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError("Could not access camera. Please ensure permissions are granted and try again.");
        try { // Fallback to user-facing camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
        } catch (fallbackError) {
             console.error("Fallback camera error:", fallbackError);
             setCameraError("Could not access any camera. Please ensure permissions are granted.");
        }
      }
    } else {
      setCameraError("Camera access is not supported by your browser.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => { // Cleanup on component unmount
      stopCamera();
    };
  }, [mode, startCamera, stopCamera]);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onFileSelect(file);
        }
      }, 'image/jpeg', 0.95);
    }
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isOver: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(isOver);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      handleDragEvents(e, false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
          handleFileChange(files);
      }
  };

  const openFileDialog = () => {
      fileInputRef.current?.click();
  };
  
  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors rounded-t-lg ${active ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        disabled={disabled}
    >
        {children}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 h-full flex flex-col animate-fade-in-up">
        <div className="flex bg-slate-100 rounded-t-lg border-b border-slate-200/80">
            <TabButton active={mode === 'upload'} onClick={() => setMode('upload')}><UploadIcon className="w-5 h-5" /> Upload File</TabButton>
            <TabButton active={mode === 'camera'} onClick={() => setMode('camera')}><CameraIcon className="w-5 h-5" /> Use Camera</TabButton>
        </div>

        <div className="flex-grow p-4">
            {mode === 'upload' && (
                <div 
                    onClick={openFileDialog}
                    onDragEnter={(e) => handleDragEvents(e, true)}
                    onDragLeave={(e) => handleDragEvents(e, false)}
                    onDragOver={(e) => handleDragEvents(e, true)}
                    onDrop={handleDrop}
                    className={`h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all duration-300 ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'}`}
                >
                    <input 
                        type="file" 
                        accept="image/jpeg, image/png"
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden" 
                        disabled={disabled}
                    />
                    <div className="flex flex-col items-center text-slate-500">
                        <UploadIcon className="w-12 h-12 mb-3 text-slate-400" />
                        <p className="text-base font-semibold text-slate-700">Drag & drop an image</p>
                        <p className="text-sm">or click to select a file</p>
                        <p className="text-xs mt-2 text-slate-400">PNG or JPG</p>
                    </div>
                </div>
            )}
            {mode === 'camera' && (
                 <div className="h-full flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden">
                    {cameraError ? (
                        <div className="text-center p-4 text-red-300">
                           <p className="font-semibold">Camera Error</p>
                           <p className="text-sm">{cameraError}</p>
                           <button onClick={startCamera} className="mt-4 px-4 py-2 text-white border border-white/50 rounded-lg text-sm hover:bg-white/10">Try Again</button>
                        </div>
                    ) : (
                        <>
                           <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                           <button 
                                onClick={handleCapture} 
                                disabled={disabled}
                                className="absolute bottom-8 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-800 font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                                aria-label="Capture photo"
                            >
                                <CameraIcon className="w-6 h-6 mr-2" />
                                Capture
                            </button>
                        </>
                    )}
                 </div>
            )}
        </div>
    </div>
  );
};
