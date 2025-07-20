import React, { useState, useEffect } from 'react';
import { BiohazardIcon, WindIcon, SunIcon, GlobeIcon } from './icons';
import { TinyLineChart } from './TinyLineChart';

type AlertCategory = 'disease' | 'air' | 'heat';

interface Alert {
    text: string;
    category: AlertCategory;
    location: string;
    data?: number[];
}

const allAlerts: Alert[] = [
  { text: "High air pollution levels detected across Northern India.", category: "air", location: "Northern India", data: [120, 150, 180, 165, 140, 170] },
  { text: "Increased risk of Dengue Fever in Southeast Asia due to monsoon season.", category: "disease", location: "Southeast Asia", data: [15, 22, 38, 55, 81, 75] },
  { text: "Heatwave warning issued for Southern Europe, risk of heatstroke.", category: "heat", location: "Southern Europe", data: [1.5, 2.1, 3.0, 3.5, 2.8, 3.2] },
  { text: "Wildfire smoke from Canadian forests affecting air quality in the US Midwest.", category: "air", location: "US Midwest", data: [80, 110, 150, 130, 90, 120] },
  { text: "Reports of water contamination in parts of Sub-Saharan Africa.", category: "disease", location: "Sub-Saharan Africa", data: [5, 10, 12, 25, 22, 30] },
  { text: "Unusually high pollen count causing allergy alerts in Northern Europe.", category: "air", location: "Northern Europe", data: [200, 400, 550, 450, 300, 500] },
  { text: "Cholera outbreak reported after recent flooding in East Africa.", category: "disease", location: "East Africa", data: [2, 8, 21, 45, 38, 50] },
  { text: "Extreme UV index warning for Australia, advising sun protection.", category: "heat", location: "Australia", data: [9, 10, 11, 11.5, 10.5, 11] },
];

const getIconForCategory = (category: AlertCategory) => {
    switch (category) {
        case 'disease': return <BiohazardIcon className="w-5 h-5 text-red-500" />;
        case 'air': return <WindIcon className="w-5 h-5 text-slate-500" />;
        case 'heat': return <SunIcon className="w-5 h-5 text-orange-500" />;
        default: return <GlobeIcon className="w-5 h-5 text-blue-500" />;
    }
};

const getChartInfo = (alert: Alert) => {
    switch (alert.category) {
        case 'disease': return { label: 'Case Trend', color: '#ef4444' }; // red-500
        case 'heat': return { label: 'Temp Anomaly', color: '#f97316' }; // orange-500
        case 'air': return { label: 'AQI Trend', color: '#64748b' }; // slate-500
        default: return null;
    }
};

export const LiveHealthAlerts: React.FC = () => {
    const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Initialize with the first few alerts
        setVisibleAlerts(allAlerts.slice(0, 4));
        setCurrentIndex(4);

        const interval = setInterval(() => {
            setVisibleAlerts(prevAlerts => {
                const newAlerts = prevAlerts.slice(1); // Remove the oldest alert
                setCurrentIndex(prevIndex => {
                    const nextIndex = (prevIndex + 1) % allAlerts.length;
                    newAlerts.push(allAlerts[nextIndex]); // Add the next alert in the cycle
                    return nextIndex;
                });
                return newAlerts;
            });
        }, 4000); // Cycle every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full max-w-4xl mx-auto py-8 px-4 mb-8">
            <h2 className="text-2xl font-bold text-center text-slate-700 mb-2">Live Global Health Alerts</h2>
            <div className="relative flex justify-center items-center">
                 <div className="h-0.5 w-16 bg-blue-500"></div>
            </div>
            <div className="mt-6 bg-white border border-slate-200/80 rounded-lg shadow-sm p-4">
                <div className="overflow-hidden h-96">
                    <div className="space-y-3">
                    {visibleAlerts.map((alert, index) => {
                        const chartInfo = getChartInfo(alert);
                        return (
                         <div key={`${alert.text}-${currentIndex}-${index}`} className="flex items-start gap-4 p-3 bg-slate-50/70 rounded-md animate-fade-in-up">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mt-1">
                                {getIconForCategory(alert.category)}
                            </div>
                            <div className="flex-grow flex justify-between items-center gap-4">
                                <div>
                                    <p className="text-slate-700 font-medium">{alert.text}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                        <span>{alert.location}</span>
                                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                        <span>Just now</span>
                                    </div>
                                </div>
                                {alert.data && chartInfo && (
                                    <div className="flex-shrink-0 text-center">
                                        <TinyLineChart data={alert.data} width={80} height={30} strokeColor={chartInfo.color} />
                                        <p className="text-xs text-slate-500 mt-1">{chartInfo.label}</p>
                                    </div>
                                )}
                            </div>
                         </div>
                        );
                    })}
                    </div>
                </div>
            </div>
        </section>
    );
};