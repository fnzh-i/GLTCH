import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check, Lock, ChevronRight, ChevronLeft, Zap, ShoppingCart,
  ArrowRight, Terminal, Download, Share2, Home, CalendarDays,
  MapPin, User, Mail, Building2, Ticket, Package, Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import confetti from "canvas-confetti";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const P = {
  primary:   "#ff5e1a",           // ember orange
  secondary: "#a855f7",           // iris purple
  warm:      "#fbbf24",           // amber gold
  hot:       "#e879f9",           // fuchsia
  bg:        "#0d1117",
  surface:   "rgba(255,255,255,0.028)",
  border:    "rgba(255,255,255,0.08)",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PASSES = [
  {
    id: "explorer", name: "EXPLORER", price: 199,
    tagline: "The essential pass", color: "#00d4ff", glow: "rgba(0,212,255,0.25)",
    features: ["3-day conference access","All 25+ talks (live & recorded)","Digital recordings forever","Community app access","NEXUS swag kit"],
  },
  {
    id: "builder", name: "BUILDER", price: 349,
    tagline: "For the serious maker", popular: true, color: "#a855f7", glow: "rgba(168,85,247,0.25)",
    features: ["Everything in Explorer","Priority front-row seating","Networking dinners (all 3 nights)","Speaker Q&A front-of-line","Exclusive Builder lounge"],
  },
  {
    id: "visionary", name: "VISIONARY", price: 599,
    tagline: "The complete experience", color: "#ff5e1a", glow: "rgba(255,94,26,0.25)",
    features: ["Everything in Builder","ALL workshops FREE (5 included)","Green room backstage access","Private speaker meet & greet","VIP afterparty + partner gift bag"],
  },
];

const WORKSHOPS = [
  { id: "design-systems", name: "Design Systems with Figma Variables",  price: 89,  duration: "2h", spots: 20, track: "Design", color: "#e879f9", day: "Day 1", instructor: "Rafael Torres" },
  { id: "ai-prompts",     name: "AI Prompt Engineering for Creatives",  price: 119, duration: "3h", spots: 15, track: "AI",     color: "#fbbf24", day: "Day 1", instructor: "Zara Ahmed" },
  { id: "webgpu",         name: "WebGPU Fundamentals Workshop",          price: 99,  duration: "2h", spots: 12, track: "Code",   color: "#a855f7", day: "Day 2", instructor: "Yuki Tanaka" },
  { id: "llm-tools",      name: "Build Your Own LLM-Powered Tool",       price: 149, duration: "4h", spots: 10, track: "AI",     color: "#fbbf24", day: "Day 2", instructor: "Cassandra Wu" },
  { id: "gen-art",        name: "Generative Art with JavaScript",        price: 79,  duration: "2h", spots: 25, track: "Design", color: "#e879f9", day: "Day 3", instructor: "Leo Park" },
];

const STEP_LABELS = ["Choose Pass", "Add Workshops", "Your Details", "Order Summary"];

interface Details { name: string; email: string; company: string; }

function genOrderId() {
  return "GX26-" + Math.random().toString(36).substring(2, 9).toUpperCase();
}

function calcTotal(passId: string | null, workshopIds: string[]): number {
  if (!passId) return 0;
  const pass = PASSES.find((p) => p.id === passId);
  if (!pass) return 0;
  const extra = passId === "visionary" ? 0 : workshopIds.reduce((s, id) => s + (WORKSHOPS.find((w) => w.id === id)?.price ?? 0), 0);
  return pass.price + extra;
}

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
function StepIndicator({ step, completedSteps }: { step: number; completedSteps: Set<number> }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 md:mb-14 px-4">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const isActive    = step === num;
        const isCompleted = completedSteps.has(num) && step > num;
        const isLocked    = step < num;
        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  background:   isCompleted ? P.primary : isActive ? `linear-gradient(135deg, ${P.primary}, ${P.secondary})` : "rgba(255,255,255,0.06)",
                  borderColor:  isCompleted ? P.primary : isActive  ? P.primary  : "rgba(255,255,255,0.12)",
                  boxShadow:    isActive ? `0 0 20px rgba(255,94,26,0.4)` : isCompleted ? `0 0 12px rgba(255,94,26,0.2)` : "none",
                }}
                transition={{ duration: 0.3 }}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, flexShrink: 0 }}
              >
                {isCompleted ? <Check size={15} color="#ffffff" strokeWidth={2.5} />
                  : isLocked ? <Lock size={13} color="rgba(255,255,255,0.2)" />
                  : <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", fontWeight: 600, color: isActive ? "#ffffff" : "rgba(255,255,255,0.3)" }}>{num}</span>}
              </motion.div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", color: isActive ? P.primary : isCompleted ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)", whiteSpace: "nowrap", textAlign: "center" }}>
                {label.toUpperCase()}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <motion.div
                animate={{ background: step > num ? `linear-gradient(90deg, ${P.primary}, rgba(168,85,247,0.3))` : "rgba(255,255,255,0.08)" }}
                transition={{ duration: 0.4 }}
                style={{ height: 2, width: "clamp(30px,6vw,80px)", borderRadius: 2, marginBottom: "1.2rem", flexShrink: 0 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PRICE SIDEBAR ────────────────────────────────────────────────────────────
function PriceSidebar({ passId, workshopIds, total }: { passId: string | null; workshopIds: string[]; total: number }) {
  const pass = PASSES.find((p) => p.id === passId);
  const workshopItems = passId !== "visionary" ? workshopIds.map((id) => WORKSHOPS.find((w) => w.id === id)).filter(Boolean) : [];
  return (
    <div style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: "16px", padding: "1.5rem", position: "sticky", top: "7rem" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: P.primary, marginBottom: "1.2rem" }}>ORDER SUMMARY</div>
      {!pass ? (
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "1.5rem 0" }}>Select a pass to see pricing</div>
      ) : (
        <>
          <div style={{ borderBottom: `1px solid ${P.border}`, paddingBottom: "1rem", marginBottom: "1rem" }}>
            <div className="flex justify-between items-center">
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: pass.color, marginBottom: "0.2rem" }}>{pass.name} Pass</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>3-day conference</div>
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#ffffff", fontSize: "0.9rem" }}>${pass.price}</span>
            </div>
          </div>
          {passId === "visionary" && (
            <div style={{ background: "rgba(255,94,26,0.08)", border: "1px solid rgba(255,94,26,0.2)", borderRadius: "8px", padding: "0.6rem 0.8rem", marginBottom: "1rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: "#ff9966", lineHeight: 1.4 }}>
              ✦ All workshops included free with Visionary
            </div>
          )}
          {workshopItems.length > 0 && (
            <div style={{ borderBottom: `1px solid ${P.border}`, paddingBottom: "1rem", marginBottom: "1rem" }}>
              {workshopItems.map((w) => w ? (
                <div key={w.id} className="flex justify-between items-center" style={{ marginBottom: "0.6rem" }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", maxWidth: "65%", lineHeight: 1.3 }}>{w.name}</div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>+${w.price}</span>
                </div>
              ) : null)}
            </div>
          )}
          <div className="flex justify-between items-center">
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#ffffff" }}>TOTAL</span>
            <motion.span key={total} initial={{ scale: 1.2, color: P.primary }} animate={{ scale: 1, color: P.primary }} transition={{ duration: 0.3 }}
              style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: "1.4rem" }}>
              ${total}
            </motion.span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
function Step1ChoosePass({ selectedPass, onSelect }: { selectedPass: string | null; onSelect: (id: string) => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>Choose Your Pass</h2>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
        Select the experience tier that fits you. You can add workshops in the next step.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PASSES.map((pass, i) => {
          const isSelected = selectedPass === pass.id;
          return (
            <motion.div key={pass.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} whileHover={{ y: -4 }}
              onClick={() => onSelect(pass.id)}
              style={{
                background: isSelected ? `linear-gradient(135deg, ${pass.color}15, rgba(255,255,255,0.04))` : P.surface,
                border: `2px solid ${isSelected ? pass.color : P.border}`,
                borderRadius: "18px", padding: "2rem 1.5rem", cursor: "pointer", position: "relative",
                transition: "border-color 0.2s ease, background 0.2s ease",
                boxShadow: isSelected ? `0 0 30px ${pass.glow}` : "none",
              }}
            >
              {pass.popular && (
                <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: pass.color, color: "#050508", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", padding: "0.25rem 0.75rem", borderRadius: "0 0 8px 8px" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ position: "absolute", top: "1.2rem", right: "1.2rem", width: 22, height: 22, borderRadius: "50%", border: `2px solid ${isSelected ? pass.color : "rgba(255,255,255,0.2)"}`, background: isSelected ? pass.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: pass.color, letterSpacing: "0.05em", marginBottom: "0.25rem", marginTop: "0.5rem" }}>{pass.name}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>{pass.tagline}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "2.8rem", fontWeight: 600, color: "#ffffff", lineHeight: 1, marginBottom: "0.25rem" }}>${pass.price}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: "1.75rem" }}>PER PERSON</div>
              <div className="flex flex-col gap-2">
                {pass.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <Check size={13} color={pass.color} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
function Step2AddWorkshops({ passId, selectedWorkshops, onToggle }: { passId: string; selectedWorkshops: string[]; onToggle: (id: string) => void }) {
  const isVisionary = passId === "visionary";
  const TC: Record<string, string> = { Design: "#e879f9", Code: "#a855f7", AI: "#fbbf24" };
  return (
    <div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>Add VIP Workshops</h2>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", marginBottom: isVisionary ? "1rem" : "2.5rem", lineHeight: 1.6 }}>
        Small-group sessions with industry experts. Spaces are extremely limited.
      </p>
      {isVisionary && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "rgba(255,94,26,0.08)", border: "1px solid rgba(255,94,26,0.25)", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Zap size={16} color={P.primary} fill={P.primary} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", color: "#ff9966", lineHeight: 1.5 }}>
            <strong style={{ color: P.primary }}>Visionary perk:</strong> All 5 workshops are included in your pass at no extra charge.
          </span>
        </motion.div>
      )}
      <div className="flex flex-col gap-3">
        {WORKSHOPS.map((workshop, i) => {
          const isSelected = isVisionary || selectedWorkshops.includes(workshop.id);
          const tc = TC[workshop.track] || P.primary;
          return (
            <motion.div key={workshop.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: i * 0.07 }}
              whileHover={!isVisionary ? { x: 4 } : {}} onClick={() => !isVisionary && onToggle(workshop.id)}
              style={{
                background: isSelected ? `linear-gradient(135deg, ${tc}10, rgba(255,255,255,0.03))` : P.surface,
                border: `1px solid ${isSelected ? tc + "44" : P.border}`,
                borderRadius: "14px", padding: "1.25rem 1.5rem",
                cursor: isVisionary ? "default" : "pointer", transition: "all 0.2s ease",
              }}
            >
              <div className="flex items-center gap-4">
                <div style={{ width: 24, height: 24, borderRadius: "6px", border: `2px solid ${isSelected ? tc : "rgba(255,255,255,0.2)"}`, background: isSelected ? tc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s ease" }}>
                  {isSelected && <Check size={13} color="#050508" strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#ffffff" }}>{workshop.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", color: tc, background: `${tc}18`, border: `1px solid ${tc}33`, borderRadius: "4px", padding: "0.15rem 0.45rem" }}>{workshop.track.toUpperCase()}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{workshop.duration} · {workshop.day}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{workshop.spots} spots · {workshop.instructor}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500, fontSize: "1rem", color: isVisionary ? "rgba(255,255,255,0.25)" : isSelected ? P.primary : "rgba(255,255,255,0.6)", textDecoration: isVisionary ? "line-through" : "none", flexShrink: 0 }}>
                  +${workshop.price}
                  {isVisionary && <span style={{ display: "block", textDecoration: "none", color: P.primary, fontSize: "0.65rem", textAlign: "right" }}>FREE</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 3 ───────────────────────────────────────────────────────────────────
function Step3Details({ details, onChange, errors }: { details: Details; onChange: (f: keyof Details, v: string) => void; errors: Partial<Record<keyof Details, string>> }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>Your Details</h2>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
        This is used to generate your ticket and badge. Double-check your name!
      </p>
      <div className="flex flex-col gap-6 max-w-lg">
        {([
          { field: "name" as const, label: "Full Name", placeholder: "Jordan Lee", required: true },
          { field: "email" as const, label: "Email Address", placeholder: "jordan@example.com", required: true },
          { field: "company" as const, label: "Company / Organisation", placeholder: "Acme Studios (optional)", required: false },
        ]).map(({ field, label, placeholder, required }) => (
          <motion.div key={field} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: errors[field] ? "#ff6699" : P.primary, marginBottom: "0.6rem" }}>
              {label.toUpperCase()}{required && <span style={{ color: P.primary }}> *</span>}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              value={details[field]}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={placeholder}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)",
                border: `1px solid ${errors[field] ? "rgba(255,94,26,0.5)" : "rgba(255,255,255,0.12)"}`,
                borderRadius: "10px", padding: "0.85rem 1.1rem", color: "#ffffff",
                fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease", boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = P.primary; e.target.style.boxShadow = "0 0 15px rgba(255,94,26,0.15)"; }}
              onBlur={(e) => { e.target.style.borderColor = errors[field] ? "rgba(255,94,26,0.5)" : "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }}
            />
            {errors[field] && <span style={{ display: "block", marginTop: "0.4rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: "#ff9966" }}>{errors[field]}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 4 SUMMARY ───────────────────────────────────────────────────────────
function Step4Summary({ passId, workshopIds, details, total, onConfirm, confirmed, orderId }: {
  passId: string; workshopIds: string[]; details: Details; total: number;
  onConfirm: () => void; confirmed: boolean; orderId: string;
}) {
  const pass = PASSES.find((p) => p.id === passId)!;
  const workshopItems = passId === "visionary" ? WORKSHOPS : workshopIds.map((id) => WORKSHOPS.find((w) => w.id === id)).filter(Boolean);
  return (
    <div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>Order Summary</h2>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem" }}>
        Review everything before confirming. The final JSON payload will be logged to console.
      </p>
      <div style={{ background: P.surface, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "18px", overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ background: `linear-gradient(135deg, ${pass.color}20, rgba(255,255,255,0.02))`, borderBottom: `1px solid ${P.border}`, padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", marginBottom: "0.3rem" }}>SELECTED PASS</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: pass.color }}>{pass.name}</div>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "2rem", fontWeight: 600, color: "#ffffff" }}>${pass.price}</div>
        </div>
        <div style={{ borderBottom: `1px solid ${P.border}`, padding: "1.25rem 1.5rem" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>ATTENDEE</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: "#ffffff", fontWeight: 600 }}>{details.name}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}>{details.email}</div>
          {details.company && <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>{details.company}</div>}
        </div>
        {workshopItems.length > 0 && (
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${P.border}` }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>WORKSHOPS ({workshopItems.length})</div>
            {workshopItems.map((w) => w && (
              <div key={w.id} className="flex justify-between items-center" style={{ marginBottom: "0.6rem" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.65)" }}>{w.name}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.82rem", color: passId === "visionary" ? P.primary : "rgba(255,255,255,0.6)" }}>{passId === "visionary" ? "FREE" : `+$${w.price}`}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ padding: "1.5rem", background: "rgba(255,94,26,0.04)" }}>
          <div className="flex justify-between items-center">
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#ffffff" }}>TOTAL DUE</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>USD · Early Bird Pricing</div>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: "2.2rem", color: P.primary }}>${total}</div>
          </div>
        </div>
      </div>
      {!confirmed && (
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255,94,26,0.4)" }}
          whileTap={{ scale: 0.98 }} onClick={onConfirm}
          style={{ width: "100%", background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`, color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.1em", padding: "1.1rem 2rem", borderRadius: "12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          <ShoppingCart size={18} /> CONFIRM & PLACE ORDER
        </motion.button>
      )}
    </div>
  );
}

// ─── ORDER CART (post-confirmation screen) ────────────────────────────────────
function QRCode() {
  // Decorative SVG QR-like pattern
  const cells = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const corners = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
      const inner   = (r === 1 && c === 1) || (r === 1 && c === 5) || (r === 5 && c === 1);
      const rand    = (r * 7 + c * 3 + r + c) % 3 === 0;
      return corners || rand || inner;
    })
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 10, border: `1px solid ${P.border}` }}>
      {cells.flat().map((filled, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: filled ? "rgba(255,255,255,0.7)" : "transparent" }} />
      ))}
    </div>
  );
}

function OrderCart({ passId, workshopIds, details, total, orderId, payload }: {
  passId: string; workshopIds: string[]; details: Details;
  total: number; orderId: string; payload: object;
}) {
  const pass = PASSES.find((p) => p.id === passId)!;
  const workshopItems = passId === "visionary" ? WORKSHOPS : workshopIds.map((id) => WORKSHOPS.find((w) => w.id === id)).filter(Boolean);
  const workshopsTotal = passId === "visionary" ? 0 : workshopIds.reduce((s, id) => s + (WORKSHOPS.find((w) => w.id === id)?.price ?? 0), 0);
  const [copied, setCopied] = useState(false);
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    const fire = (o: confetti.Options) => confetti({ particleCount: 60, spread: 70, origin: { y: 0.55 }, colors: ["#ff5e1a","#a855f7","#fbbf24","#e879f9","#ffffff"], ...o });
    setTimeout(() => { fire({ angle: 60, origin: { x: 0, y: 0.6 } }); fire({ angle: 120, origin: { x: 1, y: 0.6 } }); }, 200);
    setTimeout(() => { fire({ angle: 90, particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.5 } }); }, 600);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: "100vh", background: P.bg, paddingTop: "5rem", overflowX: "hidden" }}
    >
      <style>{`
        @keyframes float-orb { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-20px);} }
        @keyframes ticket-shine {
          0%   { left: -100%; }
          100% { left: 200%;  }
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,94,26,0.05)", filter: "blur(120px)", pointerEvents: "none", animation: "float-orb 14s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "5%", left: "3%", width: 400, height: 400, borderRadius: "50%", background: "rgba(168,85,247,0.05)", filter: "blur(100px)", pointerEvents: "none", animation: "float-orb 18s ease-in-out infinite reverse" }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── SUCCESS HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          {/* Animated check circle */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
            style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", boxShadow: `0 0 40px rgba(255,94,26,0.4)` }}
          >
            <Check size={36} color="#ffffff" strokeWidth={2.5} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.25em", color: P.primary, marginBottom: "0.75rem" }}>
              ✦ ORDER CONFIRMED ✦
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 0.75rem" }}>
              You're in, {details.name.split(" ")[0]}!
            </h1>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
              Confirmation sent to <span style={{ color: "rgba(255,255,255,0.75)" }}>{details.email}</span>. Your ticket and full details are below.
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── LEFT: TICKET STUB + RECEIPT ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Ticket stub */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
              style={{ borderRadius: "20px", overflow: "hidden", position: "relative" }}
            >
              {/* Shine sweep */}
              <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", animation: "ticket-shine 3s ease-in-out 1s 1", pointerEvents: "none", zIndex: 5 }} />

              {/* Top portion */}
              <div style={{ background: `linear-gradient(135deg, ${pass.color}22, rgba(168,85,247,0.1))`, border: `1px solid ${pass.color}44`, borderBottom: "none", padding: "2rem 2rem 1.75rem", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: "1rem" }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>GLTCH '26 · CONFERENCE TICKET</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem,3vw,2rem)", color: "#ffffff", lineHeight: 1.1, marginBottom: "0.3rem" }}>
                      {pass.name} PASS
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: pass.color }}>{pass.tagline}</div>
                  </div>
                  <div style={{ textAlign: "right" as const }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 600, color: pass.color, lineHeight: 1 }}>${pass.price}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>BASE PRICE</div>
                  </div>
                </div>

                {/* Info row */}
                <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" as const }}>
                  {[
                    { icon: CalendarDays, label: "Jun 15–17, 2026" },
                    { icon: MapPin,       label: "Moscone West, SF" },
                    { icon: Ticket,       label: "1 Attendee" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Icon size={13} color="rgba(255,255,255,0.35)" />
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tear line */}
              <div style={{ position: "relative", height: 1, background: `${pass.color}33`, overflow: "visible", display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", left: -12, width: 24, height: 24, borderRadius: "50%", background: P.bg, border: `1px solid ${pass.color}33` }} />
                <div style={{ flex: 1, borderTop: `1px dashed rgba(255,255,255,0.1)`, margin: "0 1rem" }} />
                <div style={{ position: "absolute", right: -12, width: 24, height: 24, borderRadius: "50%", background: P.bg, border: `1px solid ${pass.color}33` }} />
              </div>

              {/* Bottom portion */}
              <div style={{ background: `linear-gradient(135deg, rgba(5,5,8,0.95), ${pass.color}08)`, border: `1px solid ${pass.color}33`, borderTop: "none", padding: "1.5rem 2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: "1rem" }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: "0.3rem" }}>ORDER ID</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1rem", color: P.primary, letterSpacing: "0.08em" }}>{orderId}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Sparkles size={14} color={pass.color} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>EARLY BIRD · USD</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Itemized receipt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
              style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: "18px", overflow: "hidden" }}
            >
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${P.border}`, display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Package size={15} color={P.primary} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>ITEMIZED RECEIPT</span>
              </div>

              <div style={{ padding: "1.25rem 1.5rem" }}>
                {/* Pass line */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.85rem", borderBottom: `1px solid ${P.border}`, marginBottom: "0.85rem" }}>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#ffffff" }}>{pass.name} Conference Pass</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginTop: "0.15rem" }}>3-day all-access · Jun 15–17</div>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", color: "#ffffff" }}>${pass.price}</span>
                </div>

                {/* Workshop lines */}
                {workshopItems.length > 0 && workshopItems.map((w) => w && (
                  <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
                    <div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.84rem", color: "rgba(255,255,255,0.75)" }}>{w.name}</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.1rem" }}>{w.duration} workshop · {w.day} · {w.instructor}</div>
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.88rem", color: passId === "visionary" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)", textDecoration: passId === "visionary" ? "line-through" : "none", flexShrink: 0 }}>
                      {passId === "visionary" ? `$${w.price}` : `+$${w.price}`}
                    </span>
                  </div>
                ))}

                {/* Discount row */}
                {passId === "visionary" && workshopItems.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem", padding: "0.6rem 0.75rem", background: "rgba(255,94,26,0.06)", borderRadius: "8px", border: "1px solid rgba(255,94,26,0.15)" }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", color: P.primary }}>✦ Visionary workshop discount</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.88rem", color: P.primary }}>
                      −${WORKSHOPS.reduce((s, w) => s + w.price, 0)}
                    </span>
                  </div>
                )}

                {/* Total row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.85rem", borderTop: `1px solid ${P.border}`, marginTop: "0.5rem" }}>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#ffffff" }}>Total Charged</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem", letterSpacing: "0.08em" }}>USD · EARLY BIRD</div>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: "1.8rem", color: P.primary }}>${total}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: QR + ATTENDEE + ACTIONS + PAYLOAD ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Attendee card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
              style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: "18px", padding: "1.5rem" }}
            >
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginBottom: "1rem" }}>ATTENDEE</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.65rem" }}>
                {[
                  { Icon: User,     val: details.name },
                  { Icon: Mail,     val: details.email },
                  ...(details.company ? [{ Icon: Building2, val: details.company }] : []),
                ].map(({ Icon, val }) => (
                  <div key={val} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <Icon size={14} color="rgba(255,255,255,0.3)" />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.75)" }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* QR code area */}
              <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: `1px solid ${P.border}`, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" }}>
                <QRCode />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textAlign: "center" as const }}>
                  SCAN AT VENUE ENTRANCE
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column" as const, gap: "0.65rem" }}
            >
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(255,94,26,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{ width: "100%", background: `linear-gradient(135deg, ${P.primary}, ${P.secondary})`, color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.08em", padding: "0.85rem 1.5rem", borderRadius: "12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                >
                  <Home size={15} /> BACK TO HOME
                </motion.button>
              </Link>
              <Link to="/schedule">
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ width: "100%", background: "transparent", color: "rgba(255,255,255,0.7)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.88rem", letterSpacing: "0.06em", padding: "0.85rem 1.5rem", borderRadius: "12px", border: `1px solid ${P.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                >
                  <CalendarDays size={15} /> BROWSE SCHEDULE
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.88rem", letterSpacing: "0.06em", padding: "0.85rem 1.5rem", borderRadius: "12px", border: `1px solid rgba(255,255,255,0.08)`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <Download size={15} /> DOWNLOAD TICKET PDF
              </motion.button>
            </motion.div>

            {/* JSON payload preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
              style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(255,255,255,0.07)`, borderRadius: "14px", overflow: "hidden" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Terminal size={13} color={P.primary} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>ORDER PAYLOAD</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: copied ? "rgba(255,94,26,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${copied ? "rgba(255,94,26,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: "6px", padding: "0.25rem 0.6rem", cursor: "pointer", transition: "all 0.2s ease" }}
                >
                  {copied ? <Check size={11} color={P.primary} /> : <Share2 size={11} color="rgba(255,255,255,0.4)" />}
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: copied ? P.primary : "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>{copied ? "COPIED" : "COPY"}</span>
                </motion.button>
              </div>
              <div style={{ padding: "0.85rem 1rem", maxHeight: 220, overflowY: "auto" }}>
                <pre style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN WIZARD ──────────────────────────────────────────────────────────────
export default function TicketWizard() {
  const [step,      setStep]      = useState(1);
  const [direction, setDirection] = useState(1);
  const [completedSteps] = useState(new Set([1, 2, 3, 4]));

  const [selectedPass,      setSelectedPass]      = useState<string | null>(null);
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);
  const [details,           setDetails]           = useState<Details>({ name: "", email: "", company: "" });
  const [detailErrors,      setDetailErrors]      = useState<Partial<Record<keyof Details, string>>>({});

  const [confirmed, setConfirmed] = useState(false);
  const [orderId]   = useState(genOrderId);
  const [orderPayload, setOrderPayload] = useState<object>({});

  const total = calcTotal(selectedPass, selectedWorkshops);

  function goTo(n: number) { setDirection(n > step ? 1 : -1); setStep(n); }
  function handleBack() { if (step > 1) goTo(step - 1); }

  function handleNext() {
    if (step === 1) { if (!selectedPass) return; goTo(2); }
    else if (step === 2) { goTo(3); }
    else if (step === 3) {
      const errs: Partial<Record<keyof Details, string>> = {};
      if (!details.name.trim())  errs.name  = "Full name is required";
      if (!details.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) errs.email = "Enter a valid email";
      if (Object.keys(errs).length > 0) { setDetailErrors(errs); return; }
      setDetailErrors({});
      goTo(4);
    }
  }

  function toggleWorkshop(id: string) {
    setSelectedWorkshops((prev) => prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]);
  }

  function handleConfirm() {
    const pass = PASSES.find((p) => p.id === selectedPass);
    if (!pass) return;

    const workshopItems =
      selectedPass === "visionary"
        ? WORKSHOPS.map((w) => ({ ...w, chargedPrice: 0 }))
        : selectedWorkshops.map((id) => { const w = WORKSHOPS.find((w) => w.id === id); return w ? { ...w, chargedPrice: w.price } : null; }).filter(Boolean);

    const workshopsTotal =
      selectedPass === "visionary" ? 0
        : selectedWorkshops.reduce((s, id) => s + (WORKSHOPS.find((w) => w.id === id)?.price ?? 0), 0);

    const payload = {
      orderId,
      timestamp: new Date().toISOString(),
      conference: { name: "GLTCH '26", dates: "June 15–17, 2026", venue: "Moscone Center West, San Francisco, CA" },
      pass: { id: pass.id, name: pass.name, price: pass.price },
      workshops: workshopItems,
      attendee: { name: details.name, email: details.email, company: details.company || null },
      pricing: { basePrice: pass.price, workshopsTotal, total, currency: "USD", pricingTier: "Early Bird" },
    };

    console.log("═══════════════════════════════════════");
    console.log("🎟️  GLTCH '26 — ORDER PAYLOAD");
    console.log("═══════════════════════════════════════");
    console.log(JSON.stringify(payload, null, 2));
    console.log("═══════════════════════════════════════");

    setOrderPayload(payload);
    setConfirmed(true);
  }

  // ── Confirmed: show full cart ──
  if (confirmed && selectedPass) {
    return (
      <OrderCart
        passId={selectedPass}
        workshopIds={selectedWorkshops}
        details={details}
        total={total}
        orderId={orderId}
        payload={orderPayload}
      />
    );
  }

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ?  60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -60 :  60, opacity: 0 }),
  };

  const canProceed = step === 1 ? !!selectedPass : step === 2 ? true : step === 3 ? true : false;

  return (
    <div style={{ background: P.bg, minHeight: "100vh", paddingTop: "5rem" }}>
      <style>{`
        @keyframes float-orb { 0%,100%{transform:translate(0,0);} 50%{transform:translate(30px,-25px);} }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #0a0a0f inset; -webkit-text-fill-color: #ffffff; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: "15%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,94,26,0.04)", filter: "blur(100px)", pointerEvents: "none", animation: "float-orb 14s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "10%", left: "3%", width: 350, height: 350, borderRadius: "50%", background: "rgba(168,85,247,0.04)", filter: "blur(90px)", pointerEvents: "none", animation: "float-orb 18s ease-in-out infinite reverse" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div style={{ width: 30, height: 1, background: P.primary }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: P.primary }}>GLTCH '26 — TICKETING</span>
            <div style={{ width: 30, height: 1, background: P.primary }} />
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#ffffff", margin: 0 }}>
            CONFIGURE YOUR EXPERIENCE
          </h1>
        </motion.div>

        <StepIndicator step={step} completedSteps={completedSteps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step content */}
          <div className="lg:col-span-2">
            <div style={{ position: "relative", overflow: "hidden" }}>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}>
                  {step === 1 && <Step1ChoosePass selectedPass={selectedPass} onSelect={setSelectedPass} />}
                  {step === 2 && selectedPass && <Step2AddWorkshops passId={selectedPass} selectedWorkshops={selectedWorkshops} onToggle={toggleWorkshop} />}
                  {step === 3 && <Step3Details details={details} onChange={(f, v) => { setDetails((d) => ({ ...d, [f]: v })); setDetailErrors((e) => ({ ...e, [f]: undefined })); }} errors={detailErrors} />}
                  {step === 4 && selectedPass && <Step4Summary passId={selectedPass} workshopIds={selectedWorkshops} details={details} total={total} onConfirm={handleConfirm} confirmed={confirmed} orderId={orderId} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav buttons */}
            {step < 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex items-center justify-between mt-10 pt-6"
                style={{ borderTop: `1px solid ${P.border}` }}
              >
                <motion.button whileHover={step > 1 ? { scale: 1.03 } : {}} whileTap={step > 1 ? { scale: 0.97 } : {}} onClick={handleBack} disabled={step === 1}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", border: `1px solid rgba(255,255,255,0.12)`, color: step === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.65)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.05em", padding: "0.75rem 1.5rem", borderRadius: "10px", cursor: step === 1 ? "not-allowed" : "pointer", transition: "all 0.2s ease" }}>
                  <ChevronLeft size={16} /> BACK
                </motion.button>

                <div className="flex items-center gap-3">
                  {step === 1 && !selectedPass && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>SELECT A PASS TO CONTINUE</span>
                  )}
                  <motion.button whileHover={canProceed ? { scale: 1.03, boxShadow: "0 0 25px rgba(255,94,26,0.3)" } : {}} whileTap={canProceed ? { scale: 0.97 } : {}}
                    onClick={handleNext} disabled={!canProceed}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: canProceed ? `linear-gradient(135deg, ${P.primary}, ${P.secondary})` : "rgba(255,255,255,0.06)", border: "none", color: canProceed ? "#ffffff" : "rgba(255,255,255,0.2)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.08em", padding: "0.75rem 1.75rem", borderRadius: "10px", cursor: canProceed ? "pointer" : "not-allowed", transition: "all 0.2s ease" }}>
                    {step === 3 ? "REVIEW ORDER" : "CONTINUE"}
                    {canProceed ? <ChevronRight size={16} /> : <Lock size={14} />}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <PriceSidebar passId={selectedPass} workshopIds={selectedWorkshops} total={total} />
          </div>
        </div>

        {/* Mobile price bar */}
        <AnimatePresence>
          {selectedPass && step < 4 && (
            <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(5,5,8,0.95)", backdropFilter: "blur(20px)", borderTop: `1px solid rgba(255,94,26,0.12)`, padding: "1rem 1.5rem", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}
              className="lg:hidden"
            >
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)" }}>RUNNING TOTAL</div>
                <motion.div key={total} initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: "1.5rem", color: P.primary }}>${total}</motion.div>
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Step {step} of 4</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
