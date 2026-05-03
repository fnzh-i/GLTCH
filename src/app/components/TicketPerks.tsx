import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Check, Star, Zap, ArrowRight, Ticket, Users, Mic2,
  MonitorPlay, Coffee, Gift, ShieldCheck, Crown, Rocket,
} from "lucide-react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const BG      = "#0d1117";
const SURFACE = "#161b22";
const SURFACE2= "#21262d";
const BORDER  = "#30363d";
const TEXT    = "#e6edf3";
const MUTED   = "#8b949e";
const P       = "#ff5e1a";
const S       = "#a855f7";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PASSES = [
  {
    id: "explorer",
    name: "EXPLORER",
    price: 199,
    tagline: "The essential pass",
    color: "#38bdf8",
    icon: Ticket,
    highlight: false,
    badge: null,
    description: "Everything you need to experience GLTCH '26 — all 25+ talks, recordings, and the community.",
    features: [
      { label: "3-day full conference access",         icon: MonitorPlay },
      { label: "All 25+ talks live & recorded",        icon: Mic2 },
      { label: "Lifetime digital recordings access",   icon: MonitorPlay },
      { label: "Community app & networking feed",      icon: Users },
      { label: "Official GLTCH swag kit",              icon: Gift },
      { label: "Coffee bar access (all 3 days)",       icon: Coffee },
    ],
    notIncluded: [
      "Priority seating", "Networking dinners", "Speaker Q&A priority",
      "Builder lounge", "Free workshops", "Backstage / VIP access",
    ],
  },
  {
    id: "builder",
    name: "BUILDER",
    price: 349,
    tagline: "For the serious maker",
    color: "#a855f7",
    icon: Rocket,
    highlight: true,
    badge: "MOST POPULAR",
    description: "The full-force experience for anyone who wants to build, connect, and be in the room where it happens.",
    features: [
      { label: "Everything in Explorer",               icon: Check },
      { label: "Priority front-row seating",           icon: Star },
      { label: "Networking dinners (all 3 nights)",    icon: Users },
      { label: "Speaker Q&A front-of-line access",     icon: Mic2 },
      { label: "Exclusive Builder lounge access",      icon: ShieldCheck },
      { label: "Extended coffee & catering access",    icon: Coffee },
    ],
    notIncluded: [
      "Free workshops", "Green room backstage access",
      "Private speaker meet & greet", "VIP afterparty + partner gift bag",
    ],
  },
  {
    id: "visionary",
    name: "VISIONARY",
    price: 599,
    tagline: "The complete experience",
    color: "#ff5e1a",
    icon: Crown,
    highlight: false,
    badge: "ALL-IN",
    description: "No compromises. Every talk, every dinner, every workshop, backstage access, and the legendary VIP afterparty.",
    features: [
      { label: "Everything in Builder",                icon: Check },
      { label: "ALL 5 workshops included free",        icon: Zap },
      { label: "Green room backstage access",          icon: ShieldCheck },
      { label: "Private speaker meet & greet",         icon: Mic2 },
      { label: "VIP afterparty + premium gift bag",    icon: Gift },
      { label: "Dedicated concierge service",          icon: Star },
    ],
    notIncluded: [],
  },
];

const COMPARISON_ROWS = [
  { label: "3-day conference access",         explorer: true,   builder: true,  visionary: true  },
  { label: "All talks (live + recorded)",     explorer: true,   builder: true,  visionary: true  },
  { label: "Lifetime recordings",             explorer: true,   builder: true,  visionary: true  },
  { label: "Swag kit",                        explorer: true,   builder: true,  visionary: true  },
  { label: "Priority front-row seating",      explorer: false,  builder: true,  visionary: true  },
  { label: "Networking dinners (3 nights)",   explorer: false,  builder: true,  visionary: true  },
  { label: "Speaker Q&A priority",            explorer: false,  builder: true,  visionary: true  },
  { label: "Builder lounge",                  explorer: false,  builder: true,  visionary: true  },
  { label: "Workshops (5 sessions)",          explorer: "add-on", builder: "add-on", visionary: true },
  { label: "Green room backstage",            explorer: false,  builder: false, visionary: true  },
  { label: "Speaker meet & greet",            explorer: false,  builder: false, visionary: true  },
  { label: "VIP afterparty",                  explorer: false,  builder: false, visionary: true  },
];

const STATS = [
  { val: "500+", label: "Attendees" },
  { val: "25+",  label: "Talks" },
  { val: "3",    label: "Days" },
  { val: "4",    label: "Tracks" },
];

// ─── CELL ─────────────────────────────────────────────────────────────────────
function CompCell({ val, color }: { val: boolean | string; color: string }) {
  if (val === true)     return <Check size={16} color={color} strokeWidth={2.5} />;
  if (val === "add-on") return <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#fbbf24", letterSpacing: "0.08em" }}>ADD-ON</span>;
  return <span style={{ color: "#30363d", fontSize: "1.1rem" }}>—</span>;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TicketPerks() {
  const [hoveredPass, setHoveredPass] = useState<string | null>(null);
  const [activeTab,   setActiveTab]   = useState<"cards" | "compare">("cards");

  return (
    <div style={{ background: BG, minHeight: "100vh", paddingTop: "5rem", color: TEXT }}>
      <style>{`
        @keyframes float-orb { 0%,100%{transform:translate(0,0);} 50%{transform:translate(25px,-20px);} }
        @keyframes shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
      `}</style>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", top: "15%", right: "3%", width: 460, height: 460, borderRadius: "50%", background: "rgba(255,94,26,0.04)", filter: "blur(120px)", pointerEvents: "none", animation: "float-orb 16s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "10%", left: "2%", width: 380, height: 380, borderRadius: "50%", background: "rgba(168,85,247,0.04)", filter: "blur(100px)", pointerEvents: "none", animation: "float-orb 20s ease-in-out infinite reverse" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── HERO ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,94,26,0.08)", border: "1px solid rgba(255,94,26,0.2)", borderRadius: "100px", padding: "0.35rem 1rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: P }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.18em", color: P }}>GLTCH '26 · JUNE 15–17 · SAN FRANCISCO</span>
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: TEXT, margin: "0 0 1.25rem" }}>
            Choose Your<br />
            <span style={{ background: `linear-gradient(135deg, ${P}, ${S})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Conference Experience
            </span>
          </h1>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", color: MUTED, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 2.5rem" }}>
            Three tiers. One unforgettable conference. Pick the pass that fits your ambitions — then configure your workshops and sessions in the next step.
          </p>

          {/* Stats bar */}
          <div style={{ display: "inline-flex", gap: 0, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "14px", overflow: "hidden", flexWrap: "wrap" as const }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ padding: "0.85rem 1.75rem", borderRight: i < STATS.length - 1 ? `1px solid ${BORDER}` : "none", textAlign: "center" as const }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.3rem", color: TEXT, fontWeight: 500 }}>{s.val}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: MUTED }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── TAB SWITCHER ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "4px", gap: "4px" }}>
            {(["cards", "compare"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "7px", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", transition: "all 0.2s ease", background: activeTab === tab ? `linear-gradient(135deg, ${P}, ${S})` : "transparent", color: activeTab === tab ? "#fff" : MUTED }}>
                {tab === "cards" ? "PASS CARDS" : "COMPARE TABLE"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── PASS CARDS ── */}
        {activeTab === "cards" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "4rem" }}
          >
            {PASSES.map((pass, i) => {
              const Icon = pass.icon;
              const isHovered = hoveredPass === pass.id;
              return (
                <motion.div
                  key={pass.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setHoveredPass(pass.id)}
                  onMouseLeave={() => setHoveredPass(null)}
                  style={{
                    background: pass.highlight ? `linear-gradient(160deg, ${pass.color}14, ${SURFACE})` : SURFACE,
                    border: `1.5px solid ${isHovered || pass.highlight ? pass.color + "60" : BORDER}`,
                    borderRadius: "20px", padding: "2rem", position: "relative", overflow: "hidden",
                    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                    boxShadow: isHovered ? `0 0 35px ${pass.color}20` : pass.highlight ? `0 0 25px ${pass.color}15` : "none",
                  }}
                >
                  {/* Popular badge */}
                  {pass.badge && (
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", background: pass.color, color: pass.id === "visionary" ? "#fff" : "#000", fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", padding: "0.22rem 0.85rem", borderRadius: "0 0 9px 9px" }}>
                      {pass.badge}
                    </div>
                  )}

                  {/* Icon + name */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", marginTop: pass.badge ? "0.75rem" : 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${pass.color}20`, border: `1px solid ${pass.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color={pass.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: pass.color, letterSpacing: "0.05em" }}>{pass.name}</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: MUTED }}>{pass.tagline}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "3rem", fontWeight: 600, color: TEXT, lineHeight: 1 }}>${pass.price}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: MUTED, letterSpacing: "0.1em", marginTop: "0.2rem" }}>USD · PER PERSON · EARLY BIRD</div>
                  </div>

                  {/* Description */}
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: MUTED, lineHeight: 1.6, marginBottom: "1.5rem", minHeight: "3rem" }}>
                    {pass.description}
                  </p>

                  {/* Divider */}
                  <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: "1.25rem" }} />

                  {/* Features */}
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.7rem", marginBottom: "1.5rem" }}>
                    {pass.features.map((f) => {
                      const FIcon = f.icon;
                      return (
                        <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "5px", background: `${pass.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <FIcon size={11} color={pass.color} />
                          </div>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.84rem", color: "#c9d1d9", lineHeight: 1.4 }}>{f.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Not included (collapsed if visionary) */}
                  {pass.notIncluded.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem", marginBottom: "1.5rem" }}>
                      {pass.notIncluded.map((ni) => (
                        <div key={ni} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{ width: 14, height: 14, borderRadius: "3px", background: SURFACE2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: "0.6rem", color: "#484f58" }}>✕</span>
                          </div>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: "#484f58", textDecoration: "line-through" }}>{ni}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Link to="/tickets/configure">
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: `0 0 28px ${pass.color}35` }}
                      whileTap={{ scale: 0.98 }}
                      style={{ width: "100%", background: pass.highlight ? `linear-gradient(135deg, ${pass.color}, ${pass.id === "builder" ? "#6d28d9" : pass.color + "99"})` : `${pass.color}18`, border: `1px solid ${pass.color}50`, color: pass.highlight ? "#fff" : pass.color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.08em", padding: "0.85rem", borderRadius: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "all 0.2s ease" }}>
                      SELECT {pass.name} <ArrowRight size={15} />
                    </motion.button>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── COMPARISON TABLE ── */}
        {activeTab === "compare" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "4rem" }}>
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "18px", overflow: "hidden" }}>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ padding: "1.25rem 1.5rem" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: MUTED, letterSpacing: "0.12em" }}>FEATURE</span>
                </div>
                {PASSES.map((p) => (
                  <div key={p.id} style={{ padding: "1.25rem 1rem", textAlign: "center" as const, background: p.highlight ? `${p.color}0a` : "transparent", borderLeft: `1px solid ${BORDER}` }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: p.color, marginBottom: "0.2rem" }}>{p.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1rem", color: TEXT }}>${p.price}</div>
                    {p.badge && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: p.color, letterSpacing: "0.15em", marginTop: "0.2rem" }}>{p.badge}</div>}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {COMPARISON_ROWS.map((row, i) => (
                <div key={row.label} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid ${BORDER}` : "none", background: i % 2 === 0 ? "transparent" : `${SURFACE2}60` }}>
                  <div style={{ padding: "0.85rem 1.5rem", display: "flex", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.84rem", color: "#c9d1d9" }}>{row.label}</span>
                  </div>
                  {([row.explorer, row.builder, row.visionary] as const).map((val, j) => (
                    <div key={j} style={{ padding: "0.85rem 1rem", textAlign: "center" as const, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `1px solid ${BORDER}`, background: PASSES[j].highlight ? `${PASSES[j].color}05` : "transparent" }}>
                      <CompCell val={val} color={PASSES[j].color} />
                    </div>
                  ))}
                </div>
              ))}

              {/* CTA row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: SURFACE2 }}>
                <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: MUTED, letterSpacing: "0.1em" }}>GET STARTED</span>
                </div>
                {PASSES.map((pass) => (
                  <div key={pass.id} style={{ padding: "1rem", borderLeft: `1px solid ${BORDER}` }}>
                    <Link to="/tickets/configure">
                      <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        style={{ width: "100%", background: pass.highlight ? `linear-gradient(135deg, ${pass.color}, #6d28d9)` : `${pass.color}18`, border: `1px solid ${pass.color}40`, color: pass.highlight ? "#fff" : pass.color, fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.6rem", borderRadius: "8px", cursor: "pointer" }}>
                        SELECT
                      </motion.button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STICKY BOTTOM CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "18px", padding: "1.75rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1.25rem" }}
        >
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: TEXT, marginBottom: "0.3rem" }}>
              Ready to configure your experience?
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: MUTED }}>
              Passes from <span style={{ color: P }}>$199</span> · Add workshops · Early bird ends May 1st
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const }}>
            <Link to="/schedule" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem", padding: "0.75rem 1.5rem", borderRadius: "10px", cursor: "pointer" }}>
                Browse Schedule
              </motion.button>
            </Link>
            <Link to="/tickets/configure" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: `0 0 30px rgba(255,94,26,0.4)` }}
                whileTap={{ scale: 0.97 }}
                style={{ background: `linear-gradient(135deg, ${P}, ${S})`, border: "none", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.06em", padding: "0.75rem 1.75rem", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={15} /> CONFIGURE MY PASS <ArrowRight size={15} />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* ── TRUST BADGES ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" as const }}
        >
          {["Secure checkout", "Instant confirmation", "Full refund before Jun 1st", "Ticket transfer available"].map((badge) => (
            <div key={badge} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ShieldCheck size={13} color={MUTED} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: MUTED }}>{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
