import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Activity, Loader2, Trash2, Bot } from 'lucide-react';
import api from '../services/api';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: 'Hello! I am your AI Medical Assistant. How can I help you today?',
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

    const handleClearChat = () => {
        setMessages([{
            role: 'bot',
            text: 'Chat history cleared. How can I help you now?',
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
            console.error('AI Error:', error);
            const errorMsg = {
                role: 'bot',
                text: 'Sorry, I am having trouble connecting right now. Please check your internet or try again later.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                error: true
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[2000]">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all active:scale-95 group"
                >
                    <Bot size={36} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                </button>
            ) : (
                <div className="w-96 h-[600px] bg-white rounded-[2.5rem] shadow-2xl border-4 border-blue-50 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">

                    {/* Header */}
                    <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase leading-none">AI Helper</h3>
                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">Online & Ready</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleClearChat} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Chat */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-blue-50/30 no-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white text-blue-900 border-2 border-blue-100 rounded-2xl rounded-tl-none'} p-4 shadow-sm`}>
                                    <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                    <p className={`text-[9px] font-black uppercase mt-2 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border-2 border-blue-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-blue-600" />
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-6 bg-white border-t-2 border-blue-50">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="w-full bg-blue-50 border-2 border-transparent rounded-xl py-4 pl-6 pr-14 outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-blue-900"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-20"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
