import { useState, useEffect } from 'react';
import { Bell, Plus, Trash, Check, Clock, Calendar } from 'lucide-react';

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newReminder, setNewReminder] = useState({ title: '', time: '', dosage: '' });

    useEffect(() => {
        const savedReminders = JSON.parse(localStorage.getItem('medicare_reminders')) || [];
        setReminders(savedReminders);
    }, []);

    const saveReminders = (updatedReminders) => {
        setReminders(updatedReminders);
        localStorage.setItem('medicare_reminders', JSON.stringify(updatedReminders));
    };

    const addReminder = (e) => {
        e.preventDefault();
        const updated = [...reminders, { ...newReminder, id: Date.now(), active: true }];
        saveReminders(updated);
        setNewReminder({ title: '', time: '', dosage: '' });
        setIsAdding(false);
    };

    const deleteReminder = (id) => {
        const updated = reminders.filter(r => r.id !== id);
        saveReminders(updated);
    };

    const toggleActive = (id) => {
        const updated = reminders.map(r => r.id === id ? { ...r, active: !r.active } : r);
        saveReminders(updated);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Medicine Reminders</h1>
                    <p className="text-slate-500 font-medium mt-1">Never miss a dose with smart alerts</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
                >
                    <Plus size={20} />
                    Add Reminder
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-primary-100 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <Bell className="text-primary-600" size={24} />
                        New Reminder
                    </h3>
                    <form onSubmit={addReminder} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Medicine Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Paracetamol"
                                    value={newReminder.title}
                                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-primary-100 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                                <input
                                    required
                                    type="time"
                                    value={newReminder.time}
                                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-primary-100 transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Dosage / Instructions</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 1 tablet after food"
                                    value={newReminder.dosage}
                                    onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-primary-100 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                            >
                                Set Reminder
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {reminders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 dashed-border">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Clock size={40} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">No Reminders Set</h3>
                        <p className="text-slate-400 font-medium mt-2">Add your first medicine reminder to get started.</p>
                    </div>
                ) : (
                    reminders.map((reminder) => (
                        <div key={reminder.id} className={`p-6 rounded-[2rem] border transition-all duration-300 ${reminder.active ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-transparent opacity-60'}`}>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => toggleActive(reminder.id)}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${reminder.active ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100' : 'bg-slate-200 text-slate-400'}`}
                                >
                                    <Check size={24} />
                                </button>
                                <div className="flex-1">
                                    <h4 className={`text-xl font-bold ${reminder.active ? 'text-slate-900' : 'text-slate-500 line-through'}`}>{reminder.title}</h4>
                                    <p className="text-slate-500 font-medium">{reminder.dosage}</p>
                                </div>
                                <div className="text-right mr-6">
                                    <div className="flex items-center gap-2 text-primary-600 font-black text-lg">
                                        <Clock size={20} />
                                        {reminder.time}
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Daily</p>
                                </div>
                                <button
                                    onClick={() => deleteReminder(reminder.id)}
                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                >
                                    <Trash size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reminders;
