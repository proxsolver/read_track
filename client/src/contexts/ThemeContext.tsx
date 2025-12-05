/**
 * 테마 관리 Context
 * 
 * 3가지 테마 지원: simple, modern, kids
 * localStorage에 저장하여 영구 보존
 */

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "simple" | "modern" | "kids";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "read-track-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && ["simple", "modern", "kids"].includes(stored)) {
        return stored as Theme;
      }
    }
    return "simple";
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  // 테마 클래스를 html에 적용
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-simple", "theme-modern", "theme-kids");
    root.classList.add(`theme-${theme}`);

    // modern 테마일 때 dark 클래스도 추가
    if (theme === "modern") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
