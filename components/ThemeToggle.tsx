'use client';
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle(){
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      className="btn btn-ghost"
      onClick={()=> setTheme(isLight ? 'dark' : 'light')}
      aria-label="Tema"
      title="Cambia tema"
    >
      {isLight ? <Moon size={18}/> : <Sun size={18}/>}
      <span className="text-sm">{isLight ? 'Dark' : 'Light'}</span>
    </button>
  );
}
