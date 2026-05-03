import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Zap } from "lucide-react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
      { label: "Home", to: "/" },
      { label: "Schedule", to: "/schedule" },
      { label: "Archives", to: "/previous" }, // Added new link
      { label: "Tickets", to: "/tickets" },
    ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: scrolled ? "rgba(5,5,8,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
        }}
        className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 relative">
          
          {/* Logo (Left) */}
          <Link to="/" className="flex items-center gap-2 group relative z-10">
            <motion.div
              whileHover={{ rotate: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00ff88, #00d4ff)" }}
            >
              <Zap size={16} fill="#050508" color="#050508" />
            </motion.div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#ffffff",
                letterSpacing: "0.15em",
              }}
              className="hidden sm:block"
            >
              GLTCH<span style={{ color: "#00ff88" }}>'26</span>
            </span>
          </Link>

          {/* Desktop links (Perfectly Centered) */}
          <div 
            className="hidden md:flex items-center gap-8"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.8rem",
                    letterSpacing: "0.1em",
                    color: active ? "#00ff88" : "rgba(255,255,255,0.65)",
                    transition: "color 0.2s ease",
                    textDecoration: "none",
                    position: "relative",
                  }}
                  className="hover:text-white"
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute",
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "#00ff88",
                        borderRadius: 2,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right spacer/Hamburger (Right) */}
          <div className="flex items-center justify-end z-10">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: "#ffffff", background: "transparent", border: "none", cursor: "pointer" }}
              className="p-2"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} className="md:hidden" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu (Remains same as provided) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              background: "rgba(5,5,8,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              zIndex: 49,
              padding: "1.5rem 1.5rem",
            }}
            className="flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.1rem",
                  color: location.pathname === link.to ? "#00ff88" : "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}