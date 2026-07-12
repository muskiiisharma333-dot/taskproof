/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "secondary-fixed-dim": "#a8cbe8",
        "on-secondary": "#ffffff",
        "primary": "#6b5779",
        "on-primary-fixed-variant": "#533f60",
        "background": "#f8f9fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#e1e3e4",
        "on-primary-fixed": "#251432",
        "surface": "#f8f9fa",
        "tertiary": "#7c5264",
        "outline-variant": "#cdc4cd",
        "surface-bright": "#f8f9fa",
        "surface-tint": "#6b5779",
        "inverse-primary": "#d7bde5",
        "on-tertiary": "#ffffff",
        "secondary-fixed": "#cae6ff",
        "error": "#ba1a1a",
        "on-surface": "#191c1d",
        "on-tertiary-fixed-variant": "#623b4c",
        "on-secondary-fixed": "#001e2f",
        "surface-container-low": "#f3f4f5",
        "primary-container": "#cdb4db",
        "surface-variant": "#e1e3e4",
        "on-background": "#191c1d",
        "error-container": "#ffdad6",
        "tertiary-fixed-dim": "#edb8cc",
        "on-primary-container": "#584465",
        "on-secondary-container": "#42647e",
        "surface-container-high": "#e7e8e9",
        "primary-fixed": "#f3daff",
        "surface-dim": "#d9dadb",
        "inverse-on-surface": "#f0f1f2",
        "on-error": "#ffffff",
        "on-primary": "#ffffff",
        "surface-container": "#edeeef",
        "on-secondary-fixed-variant": "#274a63",
        "on-surface-variant": "#4a454c",
        "on-tertiary-container": "#684051",
        "on-tertiary-fixed": "#301020",
        "secondary-container": "#bee1ff",
        "outline": "#7c757d",
        "tertiary-container": "#e3aec3",
        "secondary": "#40627b",
        "inverse-surface": "#2e3132",
        "primary-fixed-dim": "#d7bde5",
        "on-error-container": "#93000a",
        "tertiary-fixed": "#ffd8e6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px",
        "card": "24px",
        "2xl": "24px"
      },
      spacing: {
        "container-max": "1200px",
        "card-padding": "24px",
        "gutter": "24px",
        "unit": "8px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "decorative-callout": ["Great Vibes", "cursive"],
        "label-sm": ["Outfit", "sans-serif"],
        "body-lg": ["Outfit", "sans-serif"],
        "headline-lg": ["Outfit", "sans-serif"],
        "body-md": ["Outfit", "sans-serif"],
        "headline-md": ["Outfit", "sans-serif"],
        "headline-lg-mobile": ["Outfit", "sans-serif"],
        "display-brand": ["Bitcount Single", "monospace"]
      },
      fontSize: {
        "decorative-callout": ["28px", { "lineHeight": "32px", "fontWeight": "400" }],
        "label-sm": ["13px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "headline-lg-mobile": ["26px", { "lineHeight": "32px", "fontWeight": "600" }],
        "display-brand": ["40px", { "lineHeight": "48px", "fontWeight": "700" }]
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(107, 87, 121, 0.1)",
        "bloom": "0 0 40px 10px rgba(205, 180, 219, 0.15)"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
