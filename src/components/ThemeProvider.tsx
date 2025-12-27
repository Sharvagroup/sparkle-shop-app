import { useEffect } from "react";
import { useSiteSetting } from "@/hooks/useSiteSettings";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  darkMode: boolean;
}

// Convert hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  if (!hex || !hex.startsWith("#")) return null;
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToString(hsl: { h: number; s: number; l: number }): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: theme } = useSiteSetting<ThemeSettings>("theme");

  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    // Apply dark mode
    if (theme.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply primary color
    if (theme.primaryColor) {
      const primaryHSL = hexToHSL(theme.primaryColor);
      if (primaryHSL) {
        root.style.setProperty("--primary", hslToString(primaryHSL));
        // Create a darker variant for hover states
        root.style.setProperty("--primary-dark", hslToString({ ...primaryHSL, l: Math.max(primaryHSL.l - 10, 0) }));
      }
    }

    // Apply secondary color
    if (theme.secondaryColor) {
      const secondaryHSL = hexToHSL(theme.secondaryColor);
      if (secondaryHSL) {
        root.style.setProperty("--secondary", hslToString(secondaryHSL));
        root.style.setProperty("--secondary-foreground", secondaryHSL.l > 50 ? "220 15% 15%" : "0 0% 100%");
      }
    }

    // Apply accent color
    if (theme.accentColor) {
      const accentHSL = hexToHSL(theme.accentColor);
      if (accentHSL) {
        root.style.setProperty("--accent", hslToString(accentHSL));
        root.style.setProperty("--accent-foreground", accentHSL.l > 50 ? "220 15% 15%" : "0 0% 100%");
      }
    }

    // Apply fonts
    if (theme.fontHeading) {
      root.style.setProperty("--font-display", `"${theme.fontHeading}", serif`);
    }
    if (theme.fontBody) {
      root.style.setProperty("--font-body", `"${theme.fontBody}", sans-serif`);
    }

    // Load Google Fonts dynamically
    const fontsToLoad = [theme.fontHeading, theme.fontBody].filter(Boolean);
    const uniqueFonts = [...new Set(fontsToLoad)];
    
    uniqueFonts.forEach((font) => {
      if (font && !document.querySelector(`link[href*="${font.replace(/ /g, "+")}"]`)) {
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    });

    return () => {
      // Cleanup: reset to defaults when component unmounts
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-dark");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--secondary-foreground");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-foreground");
      root.style.removeProperty("--font-display");
      root.style.removeProperty("--font-body");
    };
  }, [theme]);

  return <>{children}</>;
}

export default ThemeProvider;
