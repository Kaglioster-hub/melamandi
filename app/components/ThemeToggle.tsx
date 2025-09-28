"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const current = theme ?? "system";
  const next = current === "system" ? "dark" : current === "dark" ? "light" : "system";
  const label = `Tema: ${current === "system" ? `Sistema (${resolvedTheme})` : current}`;
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="btn tap-target"
      aria-label={label}
      title={label}
    >
      {label}
    </button>
  );
}

