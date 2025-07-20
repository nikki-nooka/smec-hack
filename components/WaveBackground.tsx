
import React, { useState, useEffect } from 'react';

// Function to convert lat/lng to percentage-based top/left for the map
const calculatePosition = (lat: number, lng: number): { top: string; left: string } => {
    // Equirectangular projection mapping
    const topPercent = ((90 - lat) / 180) * 100;
    const leftPercent = ((lng + 180) / 360) * 100;
    return { top: `${topPercent.toFixed(2)}%`, left: `${leftPercent.toFixed(2)}%` };
};

export const WaveBackground: React.FC = () => {
    // Default position: India
    const defaultPosition = calculatePosition(20.5937, 78.9629); 
    const [beaconPosition, setBeaconPosition] = useState(defaultPosition);

    useEffect(() => {
        // Attempt to get user's geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Animate to user's location
                    setBeaconPosition(calculatePosition(latitude, longitude));
                },
                (error) => {
                    // If denied or error, beacon stays at the default location
                    console.warn("Geolocation denied. Beacon remains at default.", error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        }
    }, []); // Runs once on component mount

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
            {/* Background Image Layer */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(//unpkg.com/three-globe/example/img/earth-blue-marble.jpg)`,
                    backgroundSize: '100% 100%', // Use 100% for accurate positioning
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.2, // Adjusted for clear visibility
                    filter: 'saturate(0.9) brightness(1.1)', // Subtle filter for aesthetics
                }}
            />

            {/* Beacon Layer */}
            <div
                className="absolute w-3 h-3 rounded-full bg-blue-500 transition-all duration-1000 ease-in-out"
                style={{
                    ...beaconPosition,
                    transform: 'translate(-50%, -50%)',
                    animation: `simple-pulse 2s infinite ease-in-out`,
                    boxShadow: `0 0 15px 3px rgba(59, 130, 246, 0.6)`,
                }}
                aria-hidden="true"
            ></div>
        </div>
    );
};
