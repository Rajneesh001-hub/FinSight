/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#f0fdf9",
          100: "#d9f3f0",
          200: "#b3e7e0",
          300: "#7ed5c6",
          400: "#52c3ac",
          500: "#2bb19d",
          600: "#1f8a82",
          700: "#2F6F63", // Primary teal
          800: "#1f5952",
          900: "#1a4844",
        },
        mint: {
          50: "#f0fdf9",
          100: "#e0faf5",
          200: "#b8f1e8",
          300: "#9BE7D3", // Primary mint
          400: "#7ddfc4",
          500: "#5fd7b5",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      backgroundColor: {
        page: "#F6F7F9",
        card: "#FFFFFF",
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
        '2xl': '16px', // Standard card radius
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '4.5': '18px',
        '5.5': '22px',
        '7.5': '30px',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [],
  safelist: [
    // Dynamic color classes that need to be included
    'bg-teal-700',
    'text-teal-700',
    'bg-green-50',
    'text-green-700',
    'bg-red-50',
    'text-red-700',
    'bg-amber-50',
    'text-amber-700',
    'bg-green-100',
    'text-green-700',
    'bg-orange-100',
    'text-orange-700',
    'bg-blue-100',
    'text-blue-700',
    'bg-purple-100',
    'text-purple-700',
    'bg-red-100',
    'text-red-700',
    'bg-yellow-100',
    'text-yellow-700',
  ],
}
