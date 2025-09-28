"use client";
import { useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";

export default function ThemeToggle(){
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("mm-theme")) as Mode | null;
    if (saved) apply(saved);
  }, []);

  function apply(next: Mode){
    setMode(next);
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    if (next === "dark") root.setAttribute("data-theme","dark");
    if (next === "light") root.setAttribute("data-theme","light");
    localStorage.setItem("mm-theme", next);
  }

  function cycle(){
    apply(mode === "system" ? "dark" : mode === "dark" ? "light" : "system");
  }

  const label =
    mode === "system" ? "Tema: Sistema" :
    mode === "dark"   ? "Tema: Scuro"   :
                        "Tema: Chiaro";

  return (
    <button onClick={cycle} className="btn tap-target" title={label} aria-label={label}>
      {label}
    </button>
  );
}
