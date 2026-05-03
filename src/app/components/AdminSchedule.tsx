import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, X, Trash2, Edit3, Clock, Users, MapPin, 
  ChevronLeft, ChevronRight, Save, LayoutGrid, CalendarDays, User
} from "lucide-react";
import talksData from "../../data/talks.json";

// ─── PALETTE (Synced with Client Schedule) ───────────────────────────────────
const BG      = "#0d1117";
const SURFACE = "#111827"; // gray-900
const BORDER  = "#1f2937"; // gray-800
const ACCENT  = "#22c55e"; // green-500
const TEXT    = "#ffffff";
const MUTED   = "#9ca3af"; // gray-400

type Talk = {
  id: number; title: string; speaker: string; role: string;
  day: number; time: string; duration: number;
  track: string; room: string; description: string;
};

const TRACKS = ["Design", "Code", "AI", "Culture"];

export default function AdminSchedule() {
  const [talks, setTalks] = useState<Talk[]>(talksData as Talk[]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // April
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingTalk, setEditingTalk] = useState<Talk | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // ─── CALENDAR LOGIC (Mirroring Client) ─────────────────────────────────────
  const getEventsForDay = (day: number) => talks.filter((t) => t.day === day);
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) weeks.push(calendarDays.slice(i, i + 7));

// ─── HANDLERS ──────────────────────────────────────────────────────────────
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const talkData = Object.fromEntries(formData.entries());
    
    // 1. Build the updated talk object
    const newTalk: Talk = {
      ...editingTalk,
      id: editingTalk?.id || Date.now(),
      title: talkData.title as string,
      speaker: talkData.speaker as string,
      role: talkData.role as string,
      track: talkData.track as string,
      room: talkData.room as string,
      time: talkData.time as string,
      duration: Number(talkData.duration),
      day: selectedDay || 1,
      description: talkData.description as string,
    } as Talk;

    // 2. Create the entire new array first using the current 'talks' state
    const updatedTalks = editingTalk 
      ? talks.map(t => t.id === newTalk.id ? newTalk : t) 
      : [...talks, newTalk];

    // 3. Save to LocalStorage (The "Database")
    localStorage.setItem('gltch_schedule', JSON.stringify(updatedTalks));

    // 4. Update the UI State
    setTalks(updatedTalks);
    
    // 5. Close the form
    setEditingTalk(null);
    setIsAdding(false);
  };

  const deleteTalk = (id: number) => {
    // 1. Filter the list
    const updatedTalks = talks.filter(t => t.id !== id);
    
    // 2. Update both State and LocalStorage
    setTalks(updatedTalks);
    localStorage.setItem('gltch_schedule', JSON.stringify(updatedTalks));
    
    setEditingTalk(null);
  };

  return (
    <div className="w-full bg-[#0d1117] text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <LayoutGrid size={20} />
              <span className="font-mono text-xs tracking-widest uppercase">Management Portal</span>
            </div>
            <h2 className="text-4xl font-bold">Admin Schedule</h2>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm font-mono">TOTAL SESSIONS: {talks.length}</p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-gray-800 rounded-lg"><ChevronLeft /></button>
          <h3 className="text-xl font-semibold font-mono tracking-tight">{monthName}</h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-gray-800 rounded-lg"><ChevronRight /></button>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-800 rounded-xl overflow-hidden bg-black/20">
          <div className="grid grid-cols-7 bg-gray-950 border-b border-gray-800">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="p-4 text-center font-bold text-gray-600 text-xs uppercase tracking-widest">{day}</div>
            ))}
          </div>

          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-cols-7 border-b border-gray-800 last:border-b-0">
              {week.map((day, dIdx) => {
                const events = day ? getEventsForDay(day) : [];
                return (
                  <div key={dIdx} 
                    onClick={() => day && setSelectedDay(day)}
                    className={`min-h-[140px] p-4 border-r border-gray-800 last:border-r-0 relative transition-all group ${day ? 'bg-gray-900/30 cursor-pointer hover:bg-gray-900/60' : 'bg-black/40'}`}
                  >
                    {day && (
                      <>
                        <span className={`text-sm font-mono ${events.length > 0 ? 'text-green-500' : 'text-gray-600'}`}>{day.toString().padStart(2, '0')}</span>
                        {events.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                              {events.length} Sessions
                            </div>
                            <div className="text-[10px] text-gray-500 truncate italic">
                              {events[0].title}
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={14} className="text-gray-500" />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ─── MODAL (Admin Version) ───────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => {setSelectedDay(null); setEditingTalk(null); setIsAdding(false);}}
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />

            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-green-500 font-mono">Day {selectedDay} Editor</h3>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">{monthName}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        <Plus size={16} /> New Session
                    </button>
                    <button onClick={() => {setSelectedDay(null); setEditingTalk(null); setIsAdding(false);}} className="p-2 hover:bg-gray-800 rounded-full text-gray-400"><X size={20} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Form View (Adding or Editing) */}
                {(isAdding || editingTalk) ? (
                  <form onSubmit={handleSave} className="bg-black/40 p-6 rounded-xl border border-green-500/30 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Talk Title</label>
                            <input name="title" defaultValue={editingTalk?.title} required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:border-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Speaker</label>
                            <input name="speaker" defaultValue={editingTalk?.speaker} required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:border-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Track</label>
                            <select name="track" defaultValue={editingTalk?.track} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:border-green-500 outline-none">
                                {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Time</label>
                            <input name="time" type="time" defaultValue={editingTalk?.time} required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:border-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Duration (min)</label>
                            <input name="duration" type="number" defaultValue={editingTalk?.duration || 45} required className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:border-green-500 outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Description</label>
                            <textarea name="description" defaultValue={editingTalk?.description} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm focus:border-green-500 outline-none resize-none" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => {setIsAdding(false); setEditingTalk(null);}} className="text-sm text-gray-400 hover:text-white">Cancel</button>
                        <button type="submit" className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Save size={16}/> Save Talk</button>
                    </div>
                  </form>
                ) : (
                  // List View (Sessions on that day)
                  getEventsForDay(selectedDay).map((event) => (
                    <div key={event.id} className="group bg-gray-800/40 border border-gray-700 p-4 rounded-xl flex justify-between items-center hover:border-gray-500 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-green-500 uppercase border border-green-500/30 px-1.5 rounded">{event.track}</span>
                            <span className="text-xs text-gray-500 font-mono">{event.time}</span>
                        </div>
                        <h4 className="font-bold text-lg">{event.title}</h4>
                        <p className="text-xs text-gray-400">{event.speaker} — {event.room}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingTalk(event)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit3 size={18} /></button>
                        <button onClick={() => deleteTalk(event.id)} className="p-2 hover:bg-red-900/30 rounded-lg text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                )}
                
                {!isAdding && !editingTalk && getEventsForDay(selectedDay).length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-2xl">
                        <CalendarDays className="mx-auto text-gray-700 mb-2" size={32} />
                        <p className="text-gray-500 text-sm italic">No sessions scheduled for this day.</p>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}