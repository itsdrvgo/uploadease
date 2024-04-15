import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: {
                    DEFAULT: "hsla(var(--border), <alpha-value>)",
                    strict: "hsla(var(--border-strict), <alpha-value>)",
                },
                input: {
                    DEFAULT: "hsla(var(--input), <alpha-value>)",
                    hover: "hsla(var(--input-hover), <alpha-value>)",
                },
                ring: "hsla(var(--ring), <alpha-value>)",
                background: {
                    DEFAULT: "hsla(var(--background), <alpha-value>)",
                    strict: "hsla(var(--background-strict), <alpha-value>)",
                },
                foreground: {
                    DEFAULT: "hsla(var(--foreground), <alpha-value>)",
                    strict: "hsla(var(--foreground-strict), <alpha-value>)",
                },
                primary: {
                    DEFAULT: "hsla(var(--primary), <alpha-value>)",
                    strict: "hsla(var(--primary-strict), <alpha-value>)",
                    foreground:
                        "hsla(var(--primary-foreground), <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "hsla(var(--secondary), <alpha-value>)",
                    foreground:
                        "hsla(var(--secondary-foreground), <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "hsla(var(--destructive), <alpha-value>)",
                    strict: "hsla(var(--destructive-strict), <alpha-value>)",
                    foreground:
                        "hsla(var(--destructive-foreground), <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsla(var(--muted), <alpha-value>)",
                    foreground: {
                        DEFAULT: "hsla(var(--muted-foreground), <alpha-value>)",
                        strict: "hsla(var(--muted-foreground-strict), <alpha-value>)",
                    },
                },
                accent: {
                    DEFAULT: "hsla(var(--accent), <alpha-value>)",
                    foreground: "hsla(var(--accent-foreground), <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsla(var(--popover), <alpha-value>)",
                    foreground:
                        "hsla(var(--popover-foreground), <alpha-value>)",
                },
                card: {
                    DEFAULT: "hsla(var(--card), <alpha-value>)",
                    foreground: "hsla(var(--card-foreground), <alpha-value>)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                meteor: {
                    "0%": {
                        transform: "rotate(215deg) translateX(0)",
                        opacity: "1",
                    },
                    "70%": { opacity: "1" },
                    "100%": {
                        transform: "rotate(215deg) translateX(-500px)",
                        opacity: "0",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "meteor-effect": "meteor 5s linear infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
