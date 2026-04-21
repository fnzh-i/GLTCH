import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navigation from "./Navigation";

export default function Root() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.style.background = "#050508";
    document.body.style.background = "#050508";
    document.body.style.fontFamily = "'Space Grotesk', sans-serif";
    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
      document.body.style.fontFamily = "";
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div style={{ background: "#050508", minHeight: "100vh", color: "#ffffff" }}>
      <Navigation />
      <Outlet />
    </div>
  );
}
