import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { startChat, sendMessageToBotStream } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { BotIcon, SendIcon, CloseIcon, ChevronDownIcon } from './icons';
import type { Chat } from '@google/genai';

export const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [chat, setChat] = useState<Chat | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chat) {
            const initialChat = startChat();
            setChat(initialChat);
            setMessages([
                { id: 'initial', role: 'bot', text: 'Hello! I am the GeoSick health assistant. How can I help you with your disease-related questions today?' }
            ]);
        }
    }, [isOpen, chat]);

    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || !chat || isLoading) return;

        const userMessageText = input;
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: userMessageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: botMessageId, role: 'bot', text: '...' }]);

        try {
            const stream = await sendMessageToBotStream(chat, userMessageText);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: fullResponse + '...' } : msg));
            }
            setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: fullResponse } : msg));
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorText = 'Sorry, I encountered an error. Please try again.';
            setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: errorText } : msg));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110 z-50 animate-pulse"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <CloseIcon className="w-7 h-7"/> : <BotIcon className="w-7 h-7" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] max-w-sm h-[70vh] max-h-[550px] bg-white border border-slate-200 rounded-lg shadow-xl flex flex-col z-40 animate-fade-in-up">
                    <header className="p-4 flex justify-between items-center rounded-t-lg border-b border-slate-200">
                        <h3 className="text-base font-semibold text-slate-800">Health Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <ChevronDownIcon className="w-6 h-6" />
                        </button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'bot' && <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-slate-500" /></div>}
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && messages[messages.length - 1]?.role !== 'bot' && (
                             <div className="flex items-end gap-2 justify-start">
                                 <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-slate-500" /></div>
                                 <div className="max-w-[80%] p-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-lg">...</div>
                             </div>
                         )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-slate-200 bg-white">
                        <div className="flex items-center bg-slate-100 rounded-lg">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about diseases..."
                                className="flex-1 bg-transparent py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading || !input} className="p-2 text-blue-500 disabled:text-slate-400 hover:text-blue-600 transition-colors">
                                <SendIcon className="w-6 h-6"/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};