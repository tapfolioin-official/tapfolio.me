export const DEFAULT_THEME_SETTINGS = {
  colors: {
    primary: "#014BAA",
    secondary: "#6b7280",
    accent: "#1D9BF0",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    background: "#f0f2f8",
    surface: "#ffffff",
    text: "#111827",
    mutedText: "#6b7280",
    border: "#e5e7eb",
    shadow: "rgba(0, 0, 0, 0.05)"
  },
  background: {
    type: "solid", // solid, gradient, mesh, image, video, animated_gradient, aurora, particles
    value: "#f0f2f8"
  },
  typography: {
    fontFamily: "Outfit",
    fontSize: "medium",
    headingSize: "1.5rem",
    bodySize: "0.95rem",
    weight: "700",
    letterSpacing: "normal",
    lineHeight: "1.5"
  },
  cards: {
    style: "rounded", // flat, rounded, floating, glass, minimal, modern
    borderRadius: "1rem",
    shadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
    border: "1px solid #e5e7eb",
    opacity: "1.0",
    blur: "0px",
    padding: "1rem",
    spacing: "0.75rem"
  },
  buttons: {
    style: "filled", // filled, outlined, ghost, gradient, rounded, pill, square
    height: "44px",
    radius: "100px",
    animation: "hover_lift"
  },
  layout: {
    style: "centered", // centered, modern, minimal, compact, business, creative
    profileWidth: "640px",
    contentWidth: "100%",
    spacing: "1.5rem",
    alignment: "center"
  },
  avatar: {
    shape: "circle", // circle, rounded, square
    border: "3px solid rgba(255, 255, 255, 0.2)",
    glow: "none",
    shadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    borderType: "none"
  },
  cover: {
    type: "none",
    value: ""
  },
  sections: {
    order: ["about", "contact", "socials", "portfolio", "projects"],
    visibility: {
      about: true,
      contact: true,
      socials: true,
      portfolio: true,
      projects: true
    }
  },
  socialIcons: {
    style: "circle", // filled, outline, minimal, rounded, circle
    size: "24px",
    spacing: "0.75rem",
    hover: "scale"
  },
  animations: {
    style: "fade", // fade, slide, scale, hover_lift, card_reveal, none
    pageTransition: "none",
    parallax: false,
    cursorGlow: false
  },
  customCss: ""
};

export const QUICK_THEMES = [
  {
    name: "Professional",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#0f172a",
        background: "#f8fafc",
        surface: "#ffffff",
        text: "#0f172a",
        mutedText: "#475569"
      }
    }
  },
  {
    name: "Minimal",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#18181b",
        background: "#ffffff",
        surface: "#f4f4f5",
        text: "#18181b",
        mutedText: "#71717a",
        border: "#e4e4e7"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        style: "minimal",
        borderRadius: "0.5rem",
        shadow: "none",
        border: "1px solid #e4e4e7"
      }
    }
  },
  {
    name: "Dark",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#3b82f6",
        background: "#09090b",
        surface: "#18181b",
        text: "#fafafa",
        mutedText: "#a1a1aa",
        border: "#27272a"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        border: "1px solid #27272a"
      }
    }
  },
  {
    name: "Ocean",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#0ea5e9",
        background: "#f0f9ff",
        surface: "#ffffff",
        text: "#0c4a6e",
        mutedText: "#0284c7"
      }
    }
  },
  {
    name: "Forest",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#16a34a",
        background: "#f0fdf4",
        surface: "#ffffff",
        text: "#14532d",
        mutedText: "#16a34a"
      }
    }
  },
  {
    name: "Royal",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#7c3aed",
        background: "#faf5ff",
        surface: "#ffffff",
        text: "#581c87",
        mutedText: "#7c3aed"
      }
    }
  },
  {
    name: "Carbon",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#f4f4f5",
        background: "#18181b",
        surface: "#27272a",
        text: "#f4f4f5",
        mutedText: "#a1a1aa",
        border: "#3f3f46"
      }
    }
  },
  {
    name: "Sunset",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#ea580c",
        background: "#fff7ed",
        surface: "#ffffff",
        text: "#431407",
        mutedText: "#ea580c"
      }
    }
  },
  {
    name: "Elegant",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#854d0e",
        background: "#fefcf0",
        surface: "#ffffff",
        text: "#422006",
        mutedText: "#854d0e"
      },
      typography: {
        ...DEFAULT_THEME_SETTINGS.typography,
        fontFamily: "Montserrat"
      }
    }
  },
  {
    name: "Glass",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
      },
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#2563eb",
        background: "#a1c4fd",
        surface: "rgba(255, 255, 255, 0.4)",
        text: "#1e3a8a",
        mutedText: "#1d4ed8",
        border: "rgba(255, 255, 255, 0.5)"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        style: "glass",
        blur: "16px",
        opacity: "0.6",
        border: "1px solid rgba(255, 255, 255, 0.4)"
      }
    }
  },
  {
    name: "Neon",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#39ff14",
        background: "#050505",
        surface: "#0f0f0f",
        text: "#ffffff",
        mutedText: "#39ff14",
        border: "#39ff14"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        style: "floating",
        shadow: "0 0 15px rgba(57, 255, 20, 0.3)"
      }
    }
  },
  {
    name: "Business",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#1e3a8a",
        background: "#f1f5f9",
        surface: "#ffffff",
        text: "#0f172a",
        mutedText: "#334155"
      },
      typography: {
        ...DEFAULT_THEME_SETTINGS.typography,
        fontFamily: "Inter"
      }
    }
  }
];

export const PREMIUM_THEMES = [
  {
    name: "Luxury",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#d4af37", // Gold
        background: "#0c0d12",
        surface: "#16171f",
        text: "#ffffff",
        mutedText: "#d4af37",
        border: "#d4af37"
      },
      typography: {
        ...DEFAULT_THEME_SETTINGS.typography,
        fontFamily: "Montserrat"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        border: "1px solid rgba(212, 175, 55, 0.3)",
        shadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
      }
    }
  },
  {
    name: "Cyber",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #0f0c20 0%, #06060c 100%)"
      },
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#ff007f", // Neon pink
        accent: "#00f0ff", // Neon cyan
        background: "#05020f",
        surface: "#0f0826",
        text: "#ffffff",
        mutedText: "#00f0ff",
        border: "#ff007f"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        border: "1px solid rgba(255, 0, 127, 0.4)",
        shadow: "0 0 20px rgba(255, 0, 127, 0.2)"
      }
    }
  },
  {
    name: "Aurora",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      background: {
        type: "aurora",
        value: "aurora-bg"
      },
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#14b8a6",
        background: "#040d12",
        surface: "rgba(20, 30, 45, 0.6)",
        text: "#f0fdfa",
        mutedText: "#2dd4bf",
        border: "rgba(20, 184, 166, 0.3)"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        style: "glass",
        blur: "20px",
        opacity: "0.5"
      }
    }
  },
  {
    name: "Liquid Glass",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
      },
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#6366f1",
        background: "#8ec5fc",
        surface: "rgba(255, 255, 255, 0.2)",
        text: "#1e1b4b",
        mutedText: "#4338ca",
        border: "rgba(255, 255, 255, 0.4)"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        style: "glass",
        blur: "30px",
        opacity: "0.3",
        borderRadius: "2rem"
      }
    }
  },
  {
    name: "Animated Gradient",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      background: {
        type: "animated_gradient",
        value: "animated-gradient-bg"
      },
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#ec4899",
        background: "#1e1b4b",
        surface: "rgba(15, 23, 42, 0.6)",
        text: "#fdf2f8",
        mutedText: "#f472b6",
        border: "rgba(236, 72, 153, 0.3)"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        style: "glass",
        blur: "12px",
        opacity: "0.6"
      }
    }
  },
  {
    name: "Neon Glow",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#00ffcc",
        background: "#000000",
        surface: "#121212",
        text: "#ffffff",
        mutedText: "#00ffcc",
        border: "#00ffcc"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        style: "floating",
        shadow: "0 0 25px rgba(0, 255, 204, 0.4)"
      }
    }
  },
  {
    name: "Space",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      background: {
        type: "particles",
        value: "space-particles"
      },
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#a855f7",
        background: "#03001e",
        surface: "rgba(15, 10, 30, 0.8)",
        text: "#faf5ff",
        mutedText: "#c084fc",
        border: "#6b21a8"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        border: "1px solid rgba(168, 85, 247, 0.3)"
      }
    }
  },
  {
    name: "Apple Style",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#0071e3",
        background: "#f5f5f7",
        surface: "#ffffff",
        text: "#1d1d1f",
        mutedText: "#86868b",
        border: "#d2d2d7"
      },
      typography: {
        ...DEFAULT_THEME_SETTINGS.typography,
        fontFamily: "Inter"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        style: "rounded",
        borderRadius: "1.25rem",
        shadow: "0 10px 30px rgba(0,0,0,0.03)"
      }
    }
  },
  {
    name: "Material You",
    settings: {
      ...DEFAULT_THEME_SETTINGS,
      colors: {
        ...DEFAULT_THEME_SETTINGS.colors,
        primary: "#6750A4",
        background: "#FEF7FF",
        surface: "#F3EDF7",
        text: "#1D1B20",
        mutedText: "#49454F",
        border: "#CAC4D0"
      },
      cards: {
        ...DEFAULT_THEME_SETTINGS.cards,
        borderRadius: "1.75rem",
        shadow: "0 1px 3px rgba(0,0,0,0.12)"
      }
    }
  }
];

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function calculateContrastRatio(color1Hex: string, color2Hex: string) {
  const rgb1 = hexToRgb(color1Hex);
  const rgb2 = hexToRgb(color2Hex);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function sanitizeCustomCss(css: string): string {
  return css
    .replace(/<[^>]*>/g, '') 
    .replace(/javascript:/gi, '') 
    .replace(/expression\([^)]*\)/gi, '') 
    .trim();
}
