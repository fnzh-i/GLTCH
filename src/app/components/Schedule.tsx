import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // April 2026
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return talks.filter((t) => t.day === day);
  };

  // Get calendar days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  // Create calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="w-full bg-black text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Schedule</h2>
          <p className="text-gray-400">Interactive event calendar</p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <h3 className="text-2xl font-semibold">{monthName}</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-950 border-b border-gray-800">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-4 text-center font-semibold text-gray-400 text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 border-b border-gray-800 last:border-b-0">
              {week.map((day, dayIdx) => {
                const events = day ? getEventsForDay(day) : [];
                const isHovered = hoveredDay === day;

                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={`min-h-32 p-4 border-r border-gray-800 last:border-r-0 ${
                      day ? "bg-gray-900 hover:bg-gray-850 cursor-pointer transition-colors" : "bg-black"
                    }`}
                    onMouseEnter={() => day && setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {day && (
                      <div className="relative h-full flex flex-col">
                        {/* Day Number */}
                        <div className="text-lg font-bold mb-2">{day}</div>

                        {/* Events Container */}
                        <div className="flex flex-col gap-2 flex-grow">
                          {events.length > 0 ? (
                            events.map((event) => (
                              <motion.div
                                key={event.id}
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                              >
                                {/* Green Event Box */}
                                <div className="w-full h-6 bg-green-500 rounded flex items-center justify-center cursor-pointer group relative">
                                  <span className="text-xs font-bold text-black">{event.time.slice(0, 5)}</span>

                                  {/* Hover Preview */}
                                  {isHovered && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-3 w-56 z-50 shadow-lg whitespace-normal"
                                    >
                                      <div className="text-sm font-semibold text-white mb-1">
                                        {event.title}
                                      </div>
                                      <div className="text-xs text-gray-300 mb-1">
                                        {event.speaker}
                                      </div>
                                      <div className="text-xs text-gray-400 mb-2">
                                        {event.room} • {event.time}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        {event.track}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-xs text-gray-600">No events</div>
                          )}
                        </div>

                        {/* Event Count Badge */}
                        {events.length > 0 && (
                          <div className="mt-2 text-xs text-gray-400">
                            {events.length} event{events.length > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Schedule;
