import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, Calendar, MapPin, Users, Mic, ChevronDown, Zap, Star } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1561577328-58217edab062?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbmVvbiUyMHRlY2glMjBmZXN0aXZhbCUyMGNyb3dkJTIwbGlnaHRzfGVufDF8fHx8MTc3Njc1NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080";
const VENUE_IMG = "https://images.unsplash.com/photo-1759477274012-263d469f0e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25mZXJlbmNlJTIwYXVkaXRvcml1bSUyMHN0YWdlJTIwZHJhbWF0aWMlMjBsaWdodGluZ3xlbnwxfHx8fDE3NzY3NTQzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080";

const CONFERENCE_DATE = new Date("2026-06-15T09:00:00");

function useCountdown() {
  const getTimeLeft = () => {
    const diff = CONFERENCE_DATE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };
  const [time, setTime] = useState(getTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const TAGLINES = ["BUILD THE FUTURE.", "DESIGN WHAT'S NEXT.", "CODE THE IMPOSSIBLE.", "SHAPE THE WORLD."];

const SPEAKERS = [
  { name: "Maya Chen", role: "Founder, Nebula Labs", track: "Culture", initials: "MC", colors: ["#00ff88", "#00d4ff"] },
  { name: "Rafael Torres", role: "Principal Designer, Stripe", track: "Design", initials: "RT", colors: ["#ff0066", "#7c3aed"] },
  { name: "Kenji Nakamura", role: "Staff Engineer, Vercel", track: "Code", initials: "KN", colors: ["#00d4ff", "#7c3aed"] },
  { name: "Zara Ahmed", role: "AI Research Lead, Runway ML", track: "AI", initials: "ZA", colors: ["#7c3aed", "#ff0066"] },
  { name: "Yuki Tanaka", role: "Graphics Eng., Google Chrome", track: "Code", initials: "YT", colors: ["#00d4ff", "#00ff88"] },
  { name: "Dr. Priya Singh", role: "Researcher, MIT", track: "AI", initials: "PS", colors: ["#ff0066", "#ffaa00"] },
  { name: "Oliver Hayes", role: "Design Engineer, Vercel", track: "Design", initials: "OH", colors: ["#00ff88", "#7c3aed"] },
  { name: "FNSH", role: "Founder, GLTCH Conference", track: "Culture", initials: "FN", colors: ["#ffaa00", "#ff0066"] },
];

const TRACK_COLORS: Record<string, string> = {
  Design: "#ff0066",
  Code: "#00d4ff",
  AI: "#7c3aed",
  Culture: "#00ff88",
};

const STATS = [
  { value: "3", label: "Days", icon: Calendar },
  { value: "25+", label: "Talks", icon: Mic },
  { value: "20+", label: "Speakers", icon: Users },
  { value: "500+", label: "Attendees", icon: Star },
];

const TICKER_ITEMS = [
  "JUN 15–17, 2026", "SAN FRANCISCO, CA", "25+ TALKS", "20+ SPEAKERS",
  "DESIGN", "CODE", "AI", "CULTURE", "500+ ATTENDEES", "GLTCH '26",
  "JUN 15–17, 2026", "SAN FRANCISCO, CA", "25+ TALKS", "20+ SPEAKERS",
  "DESIGN", "CODE", "AI", "CULTURE", "500+ ATTENDEES", "GLTCH '26",
];

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: "12px",
          padding: "0.75rem 1rem",
          minWidth: "70px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 500,
              color: "#00ff88",
              display: "block",
              lineHeight: 1,
            }}
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Landing() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const countdown = useCountdown();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => setTaglineIndex((i) => (i + 1) % TAGLINES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: "#050508", overflowX: "hidden" }}>
      <style>{`
        @keyframes glitch {
          0%, 88%, 100% { text-shadow: 0 0 40px rgba(0,255,136,0.35); transform: none; }
          90% { text-shadow: -5px 0 #ff0066, 5px 0 #00d4ff; transform: translateX(-3px); color: #00d4ff; }
          92% { text-shadow: 5px 0 #ff0066, -5px 0 #00d4ff; transform: translateX(3px); color: #ffffff; }
          94% { text-shadow: -4px 0 #ff0066, 4px 0 #00d4ff; transform: translateX(-1px); }
          96% { text-shadow: none; transform: none; color: #ffffff; }
        }
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-30px, 40px) scale(0.93); }
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scan-line {
          0% { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(0,255,136,0.3); box-shadow: 0 0 20px rgba(0,255,136,0.1); }
          50% { border-color: rgba(0,255,136,0.7); box-shadow: 0 0 40px rgba(0,255,136,0.3); }
        }
      `}</style>

      {/* ─── HERO SECTION ─── */}
      <section
        ref={heroRef}
        style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        {/* Background Image with parallax */}
        <motion.div
          style={{ y: heroY, position: "absolute", inset: "-20%", zIndex: 0 }}
        >
          <img
            src={HERO_IMG}
            alt="GLTCH Conference"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.25) saturate(1.5)" }}
          />
        </motion.div>

        {/* Dot grid overlay */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            backgroundImage: "radial-gradient(rgba(0,255,136,0.12) 1px, transparent 1px)",
            backgroundSize: "35px 35px",
          }}
        />

        {/* Gradient vignette */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "radial-gradient(ellipse at center, transparent 40%, #050508 100%)",
        }} />

        {/* Glowing orbs */}
        <div style={{
          position: "absolute", top: "15%", left: "8%", width: 400, height: 400,
          borderRadius: "50%", background: "rgba(0,255,136,0.06)",
          filter: "blur(80px)", zIndex: 1, animation: "float-orb 12s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "10%", width: 350, height: 350,
          borderRadius: "50%", background: "rgba(255,0,102,0.07)",
          filter: "blur(80px)", zIndex: 1, animation: "float-orb 16s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", top: "50%", right: "25%", width: 250, height: 250,
          borderRadius: "50%", background: "rgba(0,212,255,0.05)",
          filter: "blur(60px)", zIndex: 1, animation: "float-orb 10s ease-in-out infinite 4s",
        }} />

        {/* Scan line effect */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 1, zIndex: 3,
          background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.15), transparent)",
          animation: "scan-line 6s linear infinite",
        }} />

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity, position: "relative", zIndex: 10, width: "100%", paddingTop: "5rem" }}
          className="px-6 lg:px-16 max-w-7xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div style={{ width: 40, height: 1, background: "#00ff88" }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              color: "#00ff88",
            }}>
              THE TECH + ART CONFERENCE — JUN 15–17, 2026
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(5rem, 16vw, 17rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
              color: "#ffffff",
              animation: "glitch 9s ease-in-out infinite 2s",
              margin: 0,
            }}
          >
            GLTCH
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-6"
          >
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(3rem, 8vw, 9rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #00ff88, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 0.85,
            }}>
              '26
            </span>
            <div style={{ flex: 1, height: 4, background: "linear-gradient(90deg, #00ff88, transparent)", maxWidth: 300 }} />
          </motion.div>

          {/* Cycling tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            style={{ height: "2.5rem", overflow: "hidden", marginBottom: "2.5rem" }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {TAGLINES[taglineIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="flex gap-3 mb-10 flex-wrap"
          >
            <CountdownBox value={countdown.days} label="Days" />
            <CountdownBox value={countdown.hours} label="Hours" />
            <CountdownBox value={countdown.minutes} label="Mins" />
            <CountdownBox value={countdown.seconds} label="Secs" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/schedule">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,255,136,0.4)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "linear-gradient(135deg, #00ff88, #00d4ff)",
                  color: "#050508",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  padding: "0.9rem 2rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 0 25px rgba(0,255,136,0.25)",
                }}
              >
                EXPLORE SCHEDULE <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/tickets">
              <motion.button
                whileHover={{ scale: 1.03, borderColor: "#00ff88" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "transparent",
                  color: "#ffffff",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  letterSpacing: "0.08em",
                  padding: "0.9rem 2rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backdropFilter: "blur(10px)",
                  transition: "border-color 0.2s ease",
                }}
              >
                GET TICKETS <Zap size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>SCROLL</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={18} color="rgba(255,255,255,0.3)" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── TICKER TAPE ─── */}
      <div style={{ background: "#00ff88", overflow: "hidden", padding: "0.65rem 0" }}>
        <div style={{ display: "flex", animation: "ticker-scroll 25s linear infinite", whiteSpace: "nowrap", width: "fit-content" }}>
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                color: "#050508",
                padding: "0 2rem",
              }}
            >
              {item}
              <span style={{ marginLeft: "2rem", opacity: 0.4 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── STATS ─── */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  padding: "2rem",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
                whileHover={{ borderColor: "rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.04)" }}
              >
                <stat.icon size={28} color="#00ff88" style={{ margin: "0 auto 1rem" }} />
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.4)",
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRACKS ─── */}
      <section style={{ padding: "2rem 1.5rem 6rem" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div style={{ width: 30, height: 1, background: "#00ff88" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#00ff88" }}>THE TRACKS</span>
              <div style={{ width: 30, height: 1, background: "#00ff88" }} />
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "#ffffff", margin: 0 }}>
              Four Tracks. Infinite Ideas.
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(TRACK_COLORS).map(([track, color], i) => {
              const ICONS: Record<string, React.ReactNode> = {
                Design: <span style={{ fontSize: "2rem" }}>✦</span>,
                Code: <span style={{ fontSize: "2rem" }}>⟨/⟩</span>,
                AI: <span style={{ fontSize: "2rem" }}>◈</span>,
                Culture: <span style={{ fontSize: "2rem" }}>⬡</span>,
              };
              const DESCS: Record<string, string> = {
                Design: "Visual systems, motion, typography & brand.",
                Code: "Architecture, performance, and new APIs.",
                AI: "Models, ethics, and the machine creative.",
                Culture: "People, society, and the future of work.",
              };
              return (
                <motion.div
                  key={track}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: `linear-gradient(135deg, rgba(${color === "#ff0066" ? "255,0,102" : color === "#00d4ff" ? "0,212,255" : color === "#7c3aed" ? "124,58,237" : "0,255,136"},0.08) 0%, transparent 100%)`,
                    border: `1px solid ${color}33`,
                    borderRadius: "16px",
                    padding: "2rem 1.5rem",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <div style={{ color, marginBottom: "1rem" }}>{ICONS[track]}</div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: "0.5rem",
                  }}>
                    {track}
                  </div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.6,
                  }}>
                    {DESCS[track]}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SPEAKERS ─── */}
      <section style={{ padding: "2rem 1.5rem 6rem", background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 30, height: 1, background: "#00ff88" }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#00ff88" }}>FEATURED SPEAKERS</span>
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                World-Class Minds.
              </h2>
            </div>
            <Link to="/schedule" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.7)", borderRadius: "8px",
                  padding: "0.6rem 1.2rem", cursor: "pointer",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                  letterSpacing: "0.1em", whiteSpace: "nowrap",
                  transition: "border-color 0.2s",
                }}
              >
                VIEW ALL <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SPEAKERS.map((speaker, i) => (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  transition: "transform 0.2s ease",
                  cursor: "default",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${speaker.colors[0]}, ${speaker.colors[1]})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1rem",
                  boxShadow: `0 0 20px ${speaker.colors[0]}40`,
                }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#050508" }}>
                    {speaker.initials}
                  </span>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#ffffff", marginBottom: "0.25rem" }}>
                  {speaker.name}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.4, marginBottom: "0.75rem" }}>
                  {speaker.role}
                </div>
                <span style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: TRACK_COLORS[speaker.track],
                  background: `${TRACK_COLORS[speaker.track]}18`,
                  border: `1px solid ${TRACK_COLORS[speaker.track]}33`,
                  borderRadius: "4px",
                  padding: "0.2rem 0.5rem",
                }}>
                  {speaker.track}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VENUE ─── */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 30, height: 1, background: "#00ff88" }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#00ff88" }}>THE VENUE</span>
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", marginBottom: "1.5rem" }}>
                Moscone Center West, San Francisco
              </h2>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "2rem" }}>
                Three days inside one of SF's most iconic venues. Four uniquely designed spaces — from the massive Main Stage to the intimate Signal Room — each engineered for a different kind of encounter.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: MapPin, text: "747 Howard St, San Francisco, CA 94103" },
                  { icon: Calendar, text: "June 15 – 17, 2026" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon size={16} color="#00ff88" />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{ position: "relative", borderRadius: "20px", overflow: "hidden" }}
            >
              <img
                src={VENUE_IMG}
                alt="Venue"
                style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(5,5,8,0.7) 0%, transparent 60%)",
              }} />
              <div style={{
                position: "absolute", bottom: "1.5rem", left: "1.5rem",
                background: "rgba(0,255,136,0.95)",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <MapPin size={14} color="#050508" />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "#050508", fontWeight: 600 }}>
                  MAIN STAGE · CAP. 2,000
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{
        padding: "6rem 1.5rem",
        background: "radial-gradient(ellipse at center, rgba(0,255,136,0.05) 0%, transparent 70%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ width: 30, height: 1, background: "#00ff88" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#00ff88" }}>SECURE YOUR SPOT</span>
            <div style={{ width: 30, height: 1, background: "#00ff88" }} />
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
          }}>
            Don't just watch the future.<br />
            <span style={{ background: "linear-gradient(135deg, #00ff88, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Be part of building it.
            </span>
          </h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Passes start at $199. Workshops sell out fast. Early bird pricing ends May 1st.
          </p>
          <Link to="/tickets">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 60px rgba(0,255,136,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "linear-gradient(135deg, #00ff88, #00d4ff)",
                color: "#050508",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                padding: "1rem 3rem",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(0,255,136,0.3)",
                animation: "pulse-border 2.5s ease-in-out infinite",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              CONFIGURE YOUR TICKETS <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: "2rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div style={{
              width: 28, height: 28, borderRadius: "6px",
              background: "linear-gradient(135deg, #00ff88, #00d4ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap size={14} fill="#050508" color="#050508" />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              GLTCH <span style={{ color: "#00ff88" }}>'26</span>
            </span>
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
            © 2026 GLTCH CONFERENCE — ALL RIGHTS RESERVED
          </span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.05em", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
