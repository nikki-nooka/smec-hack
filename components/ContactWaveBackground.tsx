
import React from 'react';

// Using an equirectangular projection, which is what most flat world maps use.
// This function converts lat/lng to a percentage-based top/left style.
const calculatePosition = (lat: number, lng: number): { top: string; left: string } => {
    const topPercent = ((-lat + 90) / 180) * 100;
    const leftPercent = ((lng + 180) / 360) * 100;
    return { top: `${topPercent.toFixed(2)}%`, left: `${leftPercent.toFixed(2)}%` };
};

const getBeaconStyling = (color: 'blue' | 'purple' | 'teal') => {
    switch (color) {
        case 'blue': return 'bg-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.6)]';
        case 'purple': return 'bg-purple-500 shadow-[0_0_15px_3px_rgba(168,85,247,0.6)]';
        case 'teal': return 'bg-teal-500 shadow-[0_0_15px_3px_rgba(20,184,166,0.6)]';
    }
};

const communicationBeacons = [
    { name: 'N. America Hub', lat: 39.8283, lng: -98.5795, color: 'blue' as const },
    { name: 'Europe Hub', lat: 54.5260, lng: 15.2551, color: 'purple' as const },
    { name: 'Asia Hub', lat: 34.0479, lng: 108.9402, color: 'teal' as const },
    { name: 'S. America Hub', lat: -14.2350, lng: -51.9253, color: 'purple' as const },
    { name: 'Africa Hub', lat: -8.7832, lng: 34.5085, color: 'blue' as const },
    { name: 'Oceania Hub', lat: -25.2744, lng: 133.7751, color: 'teal' as const },
];


export const ContactWaveBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-slate-50">
            <div
                className="absolute w-[200%] max-w-none h-auto aspect-video animate-[slow-spin_120s_linear_infinite]"
                style={{
                    backgroundImage: `url(https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/land_ocean_ice_cloud_2048.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.1,
                    filter: 'grayscale(100%) brightness(1.5)',
                }}
            >
            </div>
            {/* Beacons Container */}
            <div className="absolute inset-0 w-full h-full animate-[slow-spin_120s_linear_infinite]">
                 {communicationBeacons.map((beacon, index) => {
                    const position = calculatePosition(beacon.lat, beacon.lng);
                    return (
                        <div
                            key={beacon.name}
                            className={`absolute w-2 h-2 rounded-full ${getBeaconStyling(beacon.color)}`}
                            style={{
                                ...position,
                                transform: 'translate(-50%, -50%)',
                                animation: `simple-pulse 2s infinite ease-in-out ${index * 0.3}s`,
                            }}
                            aria-hidden="true"
                        ></div>
                    );
                })}
            </div>
        </div>
    );
};
