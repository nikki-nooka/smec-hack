
import React, { useState } from 'react';
import { ArrowLeftIcon, MailIcon, SendIcon, BriefcaseIcon, MegaphoneIcon } from './icons';
import { ContactWaveBackground } from './ContactWaveBackground';

interface ContactPageProps {
  onBack: () => void;
}

type FormStatus = 'idle' | 'sending' | 'sent';

const FloatingLabelInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div className="relative z-0">
        <input 
            id={id}
            className="block py-2.5 px-0 w-full text-base text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" " 
            {...props} 
        />
        <label 
            htmlFor={id} 
            className="absolute text-base text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
            {label}
        </label>
    </div>
);

const FloatingLabelTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
    <div className="relative z-0">
        <textarea 
            id={id}
            rows={4}
            className="block py-2.5 px-0 w-full text-base text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
            {...props} 
        />
        <label 
            htmlFor={id} 
            className="absolute text-base text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
            {label}
        </label>
    </div>
);


export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;
    
    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', { name, email, message });
      setStatus('sent');
    }, 1500);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col p-4 animate-fade-in overflow-hidden">
        <ContactWaveBackground />

        <div className="relative z-10 w-full flex flex-col items-center flex-grow">
            <header className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-start items-center">
                <button 
                    onClick={onBack}
                    className="bg-white/80 backdrop-blur-md text-slate-700 font-semibold py-2 px-4 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:bg-white"
                    aria-label="Back to Home"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back
                </button>
            </header>

            <main className="flex-grow w-full max-w-6xl mx-auto flex items-center justify-center py-12 px-4">
                 <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Info */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
                            Connect With Us
                        </h1>
                        <p className="mt-4 text-lg text-slate-700">
                            Have a question, a proposal, or want to learn more? Reach out through the appropriate channel, and our team will get back to you.
                        </p>
                        <div className="mt-10 space-y-8">
                            {/* General Inquiries */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center">
                                    <MailIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">General Inquiries</h3>
                                    <p className="text-slate-600">For all general questions and support.</p>
                                    <a href="mailto:support@geosick.com" className="text-blue-600 font-medium hover:underline">support@geosick.com</a>
                                </div>
                            </div>
                            {/* Partnerships */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-500 rounded-lg flex items-center justify-center">
                                    <BriefcaseIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Partnerships</h3>
                                    <p className="text-slate-600">Interested in collaborating with us?</p>
                                    <a href="mailto:partners@geosick.com" className="text-green-600 font-medium hover:underline">partners@geosick.com</a>
                                </div>
                            </div>
                            {/* Media */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-500 rounded-lg flex items-center justify-center">
                                    <MegaphoneIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Media & Press</h3>
                                    <p className="text-slate-600">For all media-related inquiries.</p>
                                    <a href="mailto:press@geosick.com" className="text-purple-600 font-medium hover:underline">press@geosick.com</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up relative" style={{ animationDelay: '150ms' }}>
                        {status === 'sent' ? (
                            <div className="text-center p-8 bg-transparent rounded-lg animate-fade-in">
                                <h2 className="text-2xl font-semibold text-green-800">Thank You!</h2>
                                <p className="mt-2 text-green-700">Your message has been received. We'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <h2 className="text-3xl font-bold text-slate-800 mb-6">Send a Direct Message</h2>
                                <FloatingLabelInput 
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={status !== 'idle'}
                                    label="Full Name"
                                />
                                <FloatingLabelInput 
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={status !== 'idle'}
                                    label="Email Address"
                                />
                                 <FloatingLabelTextarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    disabled={status !== 'idle'}
                                    label="Your Message"
                                />
                                <button
                                  type="submit"
                                  disabled={status !== 'idle'}
                                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  <SendIcon className="w-5 h-5 mr-2" />
                                  {status === 'idle' ? 'Send Message' : 'Sending...'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
};
