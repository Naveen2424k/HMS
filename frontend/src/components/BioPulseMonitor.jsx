import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Wind, TrendingUp, Zap } from 'lucide-react';

const BioPulseMonitor = () => {
    const [pulse, setPulse] = useState(72);
    const [temp, setTemp] = useState(36.6);
    const [oxygen, setOxygen] = useState(99);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(prev => prev + (Math.random() > 0.5 ? 1 : -1));
            setTemp(prev => parseFloat((prev + (Math.random() > 0.5 ? 0.05 : -0.05)).toFixed(2)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const vitals = [
        { label: 'Neural Heart Rate', val: pulse, unit: 'BPM', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Bio-Temperature', val: temp, unit: '°C', icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Oxygen Saturation', val: oxygen, unit: '%', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vitals.map((stat, i) => (
                <div key={i} className="luxury-card p-10 bg-white/80 backdrop-blur-2xl border border-white shadow-luxury hover:translate-y-[-8px] transition-all duration-700 group relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} border border-current/10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                            <stat.icon size={28} className={i === 0 ? "animate-pulse" : ""} />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-xl text-[9px] font-black tracking-widest text-slate-400 uppercase border border-slate-100 italic">
                            <TrendingUp size={10} />
                            Stable
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-6xl font-[1000] text-slate-950 tracking-tighter italic leading-none">{stat.val}</p>
                            <span className="text-xs font-black text-slate-300 uppercase tracking-widest not-italic">{stat.unit}</span>
                        </div>
                    </div>

                    <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:scale-150 transition-transform duration-1000 grayscale">
                        <stat.icon size={150} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BioPulseMonitor;
