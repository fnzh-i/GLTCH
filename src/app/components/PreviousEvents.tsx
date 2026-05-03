import { motion } from "motion/react";
import { Calendar, Users, MapPin, ArrowUpRight } from "lucide-react";

const ARCHIVE_DATA = [
  {
    year: "2025",
    theme: "Synthetic Minds",
    location: "Tokyo, JP",
    attendees: "1,200",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    color: "#00d4ff",
    description: "Our largest gathering to date, focusing on the intersection of neural networks and human intuition in the heart of Shinjuku."
  },
  {
    year: "2024",
    theme: "Recursive Reality",
    location: "Berlin, DE",
    attendees: "850",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    color: "#ff0066",
    description: "Explored the boundaries of spatial computing and how digital layers are permanently altering our physical world."
  },
  {
    year: "2023",
    theme: "Zero Protocol",
    location: "Austin, TX",
    attendees: "500",
    // Fixed: Replaced the broken Google link with a high-quality tech event image
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    color: "#7c3aed",
    description: "The inaugural event. A deep dive into decentralized systems and the future of open-source creative tools."
  }
];

export default function PreviousEvents() {
  return (
    <div style={{ background: "#050508", minHeight: "100vh", paddingTop: "120px", paddingBottom: "100px" }} className="px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section remains unchanged */}
        <header className="mb-24">
          {/* ... (Header code) */}
        </header>

        {/* Events List */}
        <div className="flex flex-col gap-16 md:gap-32">
          {ARCHIVE_DATA.map((event, i) => (
            <motion.section
              key={event.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="group relative"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Year Badge */}
                <div className="lg:col-span-2">
                  <div style={{ 
                    fontFamily: "'Space Grotesk', sans-serif", 
                    fontSize: "4rem", 
                    fontWeight: 800, 
                    color: event.color,
                    lineHeight: 1
                  }}>
                    {event.year}
                  </div>
                </div>

                {/* Main Card Container */}
                <div className="lg:col-span-10 grid md:grid-cols-2 gap-10">
                  
                  {/* Text Details */}
                  <div className="flex flex-col justify-center order-2 md:order-1">
                    <h2 style={{ 
                      fontFamily: "'Space Grotesk', sans-serif", 
                      fontSize: "2.2rem", 
                      fontWeight: 700, 
                      color: "#ffffff",
                      marginBottom: "1rem" 
                    }}>
                      {event.theme}
                    </h2>

                    {/* NEW: Description injected here */}
                    <p style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                      maxWidth: "90%"
                    }}>
                      {event.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-6 mb-8">
                      <div className="flex items-center gap-2 text-white/60" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>
                        <MapPin size={16} color={event.color} />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-white/60" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>
                        <Users size={16} color={event.color} />
                        {event.attendees} Attendees
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ x: 5 }}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "0.5rem", 
                        background: "none", 
                        border: "none", 
                        color: event.color,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        padding: 0
                      }}
                    >
                      VIEW ARCHIVE REPORT <ArrowUpRight size={14} />
                    </motion.button>
                  </div>

                  {/* Image section remains unchanged */}
                  <div className="order-1 md:order-2">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      style={{ 
                        position: "relative", 
                        borderRadius: "20px", 
                        overflow: "hidden", 
                        height: "350px",
                        border: `1px solid rgba(255,255,255,0.1)`
                      }}
                    >
                      <img 
                        src={event.image} 
                        alt={event.theme} 
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover", 
                          transition: "filter 0.6s ease",
                        }} 
                        className="grayscale group-hover:grayscale-0"
                      />
                      <div style={{ 
                        position: "absolute", 
                        inset: 0, 
                        background: `linear-gradient(to top, #050508, transparent)`,
                        opacity: 0.6 
                      }} />
                    </motion.div>
                  </div>

                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}