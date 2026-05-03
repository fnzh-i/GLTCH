import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X, Clock, MapPin, User } from "lucide-react";
import talksData from "../../data/talks.json";

type Talk = {
  id: number;
  title: string;
  speaker: string;
  role: string;
  day: number;
  time: string;
  duration: number;
  track: string;
  room: string;
  description: string;
};

const talks: Talk[] = talksData as Talk[];

function Schedule() {
  const [talks, setTalks] = useState<Talk[]>(talksData as Talk[]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return talks.filter((t) => t.day === day);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  useEffect(() => {
    const saved = localStorage.getItem('gltch_schedule');
    if (saved) {
      try {
        setTalks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse schedule from local storage", e);
      }
    }
  }, []);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  // Events for the modal
  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="w-full bg-[#0d1117] text-white min-h-screen p-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Schedule</h2>
          <p className="text-gray-400">Click a day to view full schedule</p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-900 rounded-lg"><ChevronLeft /></button>
          <h3 className="text-2xl font-semibold">{monthName}</h3>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-900 rounded-lg"><ChevronRight /></button>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-950 border-b border-gray-800">
            {weekDays.map(day => <div key={day} className="p-4 text-center font-semibold text-gray-500 text-sm">{day}</div>)}
          </div>

          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 border-b border-gray-800 last:border-b-0">
              {week.map((day, dayIdx) => {
                const events = day ? getEventsForDay(day) : [];
                return (
                  <motion.div
                    key={`${weekIdx}-${dayIdx}`}
                    whileHover={day ? { backgroundColor: "#111" } : {}}
                    onClick={() => day && events.length > 0 && setSelectedDay(day)}
                    className={`min-h-32 p-4 border-r border-gray-800 last:border-r-0 relative transition-colors ${
                      day ? "bg-gray-900/50 cursor-pointer" : "bg-black"
                    }`}
                  >
                    {day && (
                      <>
                        <span className="text-lg font-bold text-gray-400">{day}</span>
                        {events.length > 0 && (
                          <div className="mt-2">
                            <div className="bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                              {events.length} {events.length === 1 ? 'Event' : 'Events'}
                            </div>
                            <div className="mt-1 text-[10px] text-gray-500 truncate">
                              {events[0].title}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <div>
                  <h3 className="text-2xl font-bold">Schedule for {monthName.split(' ')[0]} {selectedDay}</h3>
                  <p className="text-gray-400 text-sm">{selectedEvents.length} sessions scheduled</p>
                </div>
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
                {selectedEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="group bg-gray-800/50 border border-gray-700 p-5 rounded-xl hover:border-green-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold uppercase">
                        {event.track}
                      </span>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock size={14} className="mr-1" /> {event.time} ({event.duration}m)
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                      {event.title}
                    </h4>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <User size={14} className="mr-1 text-gray-500" />
                        {event.speaker} <span className="text-gray-500 ml-1">({event.role})</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-500" />
                        {event.room}
                      </div>
                    </div>
                    
                    <p className="mt-4 text-gray-400 text-sm leading-relaxed border-t border-gray-700/50 pt-4">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Schedule;