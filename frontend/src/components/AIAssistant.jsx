import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, MessageSquare, Zap, Terminal, Activity, Loader2, BrainCircuit, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';
import api from '../services/api';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: 'Neural Nexus initialized. Diagnostic protocols active. How can I assist your biological optimization today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleClearChat = () => {
        setMessages([{
            role: 'bot',
            text: 'Neural Link Purged. Diagnostic protocols re-initialized.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    const handleSend = async (retryContent = null) => {
        const textToSend = retryContent || input;
        if (!textToSend.trim() || isTyping) return;

        if (!retryContent) {
            const userMsg = { role: 'user', text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prev => [...prev, userMsg]);
            setInput('');
        }

        setIsTyping(true);

        try {
            const { data } = await api.post('/ai/chat', { message: textToSend });
            const botMsg = {
                role: 'bot',
                text: data.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Neural Sync Error:', error);
            const errorMsg = {
                role: 'bot',
                text: 'CRITICAL ERROR: High-latency detected in Neural Link. System synchronization failed. Ensure your Gemini API Key is configured in the backend environment.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                error: true,
                content: textToSend
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-[3000]">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-24 h-24 bg-slate-950 text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_70px_-15px_rgba(15,23,42,0.6)] hover:bg-primary-600 transition-all duration-700 group relative overflow-hidden active:scale-95 border-b-4 border-slate-900 hover:border-primary-700"
                >
                    <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-20 translate-y-[100%] group-hover:translate-y-0 transition-all duration-700"></div>
                    <BrainCircuit size={40} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-50 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                </button>
            ) : (
                <div className="w-[500px] h-[750px] bg-white rounded-[4rem] shadow-[0_60px_150px_-30px_rgba(15,23,42,0.4)] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 relative">
                    {/* Header */}
                    <div className="p-10 bg-slate-950 text-white flex items-center justify-between relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/10 rounded-full blur-[80px]"></div>

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner group">
                                <Sparkles size={32} className="text-primary-400 group-hover:animate-spin-slow transition-all" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-[1000] tracking-tighter uppercase italic leading-none flex items-center gap-3">
                                    Neural <span className="text-primary-500">Nexus</span>
                                </h3>
                                <div className="flex items-center gap-2 mt-2.5">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400/80 italic">Global Sync Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                            <button
                                onClick={handleClearChat}
                                title="Purge Protocols"
                                className="p-4 hover:bg-white/10 rounded-2xl transition-all active:scale-95 group"
                            >
                                <Trash2 size={20} className="text-slate-500 group-hover:text-rose-400" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close Interface"
                                className="p-4 hover:bg-white/10 rounded-2xl transition-all active:scale-95 group"
                            >
                                <X size={28} className="text-slate-500 group-hover:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar bg-slate-50/50 scroll-smooth">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}>
                                <div className={`max-w-[85%] space-y-3`}>
                                    <div className={`p-8 rounded-[2.5rem] font-bold text-[15px] leading-relaxed shadow-luxury-sm border transition-all duration-500 ${msg.role === 'user'
                                        ? 'bg-slate-950 text-white border-slate-900 rounded-tr-none'
                                        : msg.error
                                            ? 'bg-rose-50 text-rose-600 border-rose-100 rounded-tl-none shadow-[0_10px_30px_rgba(244,63,94,0.1)]'
                                            : 'bg-white text-slate-800 border-slate-100 rounded-tl-none shadow-luxury-lg hover:border-primary-100'
                                        }`}>
                                        <div className="flex gap-4">
                                            {msg.role === 'bot' && (
                                                msg.error ? <ShieldAlert size={22} className="mt-1 shrink-0 text-rose-500 animate-pulse" /> : <Bot size={22} className="mt-1 shrink-0 text-primary-600" />
                                            )}
                                            <div className="space-y-4 flex-1">
                                                <p className={msg.error ? "italic font-black uppercase tracking-tight" : "whitespace-pre-wrap"}>{msg.text}</p>

                                                {msg.error && (
                                                    <button
                                                        onClick={() => handleSend(msg.content)}
                                                        className="flex items-center gap-3 px-6 py-3 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg"
                                                    >
                                                        <RefreshCw size={14} className="animate-spin-slow" />
                                                        Reset Neural Link
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 ${msg.role === 'user' ? 'text-right text-slate-400' : 'text-left text-slate-300'}`}>
                                        {msg.role === 'user' ? 'Entity Pulse' : msg.error ? 'System Alert' : 'Neural Response'} • {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] rounded-tl-none shadow-luxury-md flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Neural Processing...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-10 bg-white border-t border-slate-50 relative shrink-0">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isTyping}
                                placeholder={isTyping ? "Awaiting Core Response..." : "Establish Neural Protocol..."}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] py-7 pl-10 pr-20 outline-none focus:border-primary-500/30 focus:bg-white transition-all font-black text-[15px] tracking-tight text-slate-900 disabled:opacity-50"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={isTyping || !input.trim()}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-slate-950 text-white rounded-3xl flex items-center justify-center hover:bg-primary-600 transition-all shadow-2xl active:scale-95 disabled:opacity-20 group"
                            >
                                <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
