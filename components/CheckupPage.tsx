

import React, { useState } from 'react';
import { geocodeLocation, findFacilitiesByCoordinates } from '../services/geminiService';
import { ArrowLeftIcon, HeartPulseIcon, BuildingOfficeIcon, UserIcon, MailOpenIcon, SendIcon, DirectionsIcon, MagnifyingGlassIcon, CrosshairsIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import type { Facility } from '../types';

interface CheckupPageProps {
  onBack: () => void;
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

type PaidFormStatus = 'idle' | 'sending' | 'sent';
type LocationStatus = 'idle' | 'fetching_gps' | 'geocoding' | 'finding_facilities' | 'success' | 'error';

export const CheckupPage: React.FC<CheckupPageProps> = ({ onBack }) => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
    const [locationError, setLocationError] = useState<string | null>(null);
    const [searchCoords, setSearchCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [manualLocationInput, setManualLocationInput] = useState('');
    
    const [paidFormStatus, setPaidFormStatus] = useState<PaidFormStatus>('idle');
    const [formState, setFormState] = useState({ name: '', address: '', phone: '', date: '', email: '' });

    const resetLocationState = () => {
        setFacilities([]);
        setLocationStatus('idle');
        setLocationError(null);
        setSearchCoords(null);
    };

    const findAndSetFacilities = async (coords: { lat: number, lng: number }) => {
        setLocationStatus('finding_facilities');
        setFacilities([]);
        setLocationError(null);
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
            setLocationStatus('success');
        } catch (error) {
            console.error("Facility finding error:", error);
            setLocationError("Could not find facilities. The AI model might be busy or unavailable.");
            setLocationStatus('error');
        }
    };
    
    const handleUseCurrentLocation = () => {
        resetLocationState();
        setLocationStatus('fetching_gps');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const coords = { lat: latitude, lng: longitude };
                setSearchCoords(coords);
                findAndSetFacilities(coords);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError("Could not get your location. Please enable location services in your browser.");
                setLocationStatus('error');
            }
        );
    };

    const handleManualSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualLocationInput.trim()) return;
        resetLocationState();
        setLocationStatus('geocoding');
        try {
            const coords = await geocodeLocation(manualLocationInput);
            setSearchCoords(coords);
            await findAndSetFacilities(coords);
        } catch (error) {
            console.error("Geocoding error:", error);
            setLocationError("Could not find that location. Please try being more specific (e.g., 'Paris, France').");
            setLocationStatus('error');
        }
    };

    const handlePaidSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPaidFormStatus('sending');
        const { name, address, phone, date, email } = formState;
        const recipient = 'appointments@geosick.com';
        const subject = `Appointment Request for ${name}`;
        const body = `A new in-person visit has been requested.

Patient Details:
----------------
Name: ${name}
Address: ${address}
Phone: ${phone}
Preferred Date: ${date}
Confirmation Email: ${email}

Please contact the patient at the provided email to confirm the appointment and provider details.
        `;
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&bcc=${encodeURIComponent(email)}`;
        window.location.href = mailtoLink;
        setTimeout(() => {
            setPaidFormStatus('sent');
        }, 500);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

  return (
    <div className="w-full min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in bg-slate-50">
        <header className="w-full max-w-6xl mx-auto flex justify-start items-center">
            <button 
                onClick={onBack}
                className="bg-white/80 backdrop-blur-md text-slate-700 font-semibold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:bg-white"
                aria-label="Back to Analysis"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Report
            </button>
        </header>

        <main className="flex-grow flex flex-col items-center mt-8">
            <div className="text-center">
                <HeartPulseIcon className="w-16 h-16 mx-auto text-green-500" />
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mt-4">Schedule a Checkup</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-600">
                    Take the next step towards ensuring your health and safety. Choose an option below.
                </p>
            </div>

            <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Free Checkup */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 h-full flex flex-col">
                    <div className="flex items-center gap-3">
                        <BuildingOfficeIcon className="w-10 h-10 text-blue-500"/>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Community Health Resources</h2>
                            <p className="text-slate-500 text-sm">Find nearby facilities worldwide</p>
                        </div>
                    </div>
                     <div className="mt-4 border-t border-slate-200 pt-4 space-y-4">
                        <form onSubmit={handleManualSearch} className="flex gap-2">
                             <input
                                type="text"
                                value={manualLocationInput}
                                onChange={(e) => setManualLocationInput(e.target.value)}
                                placeholder="Enter a City or Address"
                                className="flex-grow block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                disabled={locationStatus === 'geocoding' || locationStatus === 'finding_facilities'}
                            />
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-all" disabled={!manualLocationInput || locationStatus === 'geocoding' || locationStatus === 'finding_facilities'}>
                               <MagnifyingGlassIcon className="w-5 h-5" />
                            </button>
                        </form>
                         <div className="flex items-center gap-2">
                            <hr className="flex-grow border-slate-200" />
                            <span className="text-xs font-semibold text-slate-400">OR</span>
                            <hr className="flex-grow border-slate-200" />
                        </div>
                        <button onClick={handleUseCurrentLocation} disabled={locationStatus === 'fetching_gps' || locationStatus === 'finding_facilities'} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-70">
                           <CrosshairsIcon className="w-5 h-5 mr-2" /> Use My Current Location
                        </button>
                    </div>

                    <div className="mt-6 flex-grow">
                        {locationStatus === 'fetching_gps' && <div className="flex items-center justify-center text-slate-600"><LoadingSpinner /><span className="ml-3">Getting your location...</span></div>}
                        {locationStatus === 'geocoding' && <div className="flex items-center justify-center text-slate-600"><LoadingSpinner /><span className="ml-3">Geocoding location...</span></div>}
                        {locationStatus === 'finding_facilities' && <div className="flex items-center justify-center text-slate-600"><LoadingSpinner /><span className="ml-3">Finding nearby facilities...</span></div>}
                        {locationStatus === 'error' && <p className="text-sm text-red-600 mt-2 text-center p-3 bg-red-50 rounded-md">{locationError}</p>}
                        
                        {locationStatus === 'success' && (
                            facilities.length > 0 ? (
                                <div className="space-y-3 animate-fade-in">
                                    <h3 className="font-semibold text-slate-700">Nearest Facilities Found ({facilities.length}):</h3>
                                    <ul className="divide-y divide-slate-200 border rounded-md max-h-96 overflow-y-auto">
                                        {facilities.map((facility, index) => {
                                            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
                                            return (
                                            <li key={index} className="p-3 flex justify-between items-center">
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
                                </div>
                            ) : (
                                <div className="p-4 mt-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 animate-fade-in text-center" role="alert">
                                    <p className="font-bold">No Facilities Found</p>
                                    <p className="text-sm">Our AI couldn't find any health facilities within a 5km radius. Please try a different or more specific location.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Paid Checkup */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 h-full flex flex-col">
                    <div className="flex items-center gap-3">
                        <UserIcon className="w-10 h-10 text-green-500"/>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Personalized In-Person Visit</h2>
                            <p className="text-slate-500 text-sm">Paid consultation</p>
                        </div>
                    </div>
                    <p className="mt-4 text-slate-600 flex-grow">
                        Fill out the form to request a health professional visit. We'll open your email client to send the request.
                    </p>
                    {paidFormStatus === 'sent' ? (
                        <div className="text-center p-6 mt-6 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                            <MailOpenIcon className="w-12 h-12 mx-auto text-green-600 mb-2"/>
                            <h3 className="text-xl font-semibold text-green-800">Check Your Email Client!</h3>
                            <p className="mt-2 text-green-700">Your email app should be open. Please review and send the request. You will receive a copy in your own inbox for confirmation. A local provider will contact you to finalize your appointment.</p>
                        </div>
                    ) : (
                        <form onSubmit={handlePaidSubmit} className="space-y-4 mt-6">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                              <input id="name" name="name" type="text" placeholder="Your Full Name" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formState.name} onChange={handleInputChange} disabled={paidFormStatus === 'sending'} />
                            </div>
                             <div>
                              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email for Confirmation</label>
                              <input id="email" name="email" type="email" placeholder="you@example.com" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formState.email} onChange={handleInputChange} disabled={paidFormStatus === 'sending'} />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-slate-700">Full Address</label>
                                <input id="address" name="address" type="text" placeholder="Your Full Address for the Visit" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formState.address} onChange={handleInputChange} disabled={paidFormStatus === 'sending'} />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                                <input id="phone" name="phone" type="tel" placeholder="Your Contact Phone Number" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formState.phone} onChange={handleInputChange} disabled={paidFormStatus === 'sending'} />
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-slate-700">Preferred Date</label>
                                <input id="date" name="date" type="date" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formState.date} onChange={handleInputChange} disabled={paidFormStatus === 'sending'} min={new Date().toISOString().split("T")[0]} />
                            </div>
                            <button
                              type="submit"
                              disabled={paidFormStatus === 'sending'}
                              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <SendIcon className="w-5 h-5 mr-2" />
                                {paidFormStatus === 'sending' ? 'Preparing...' : 'Prepare Visit Request Email'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};