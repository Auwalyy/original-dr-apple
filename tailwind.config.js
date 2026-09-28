const { platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Mirrors the website's `font-serif` / `font-mono` stacks (Georgia + Menlo).
      fontFamily: {
        serif: platformSelect({
          ios: 'Georgia',
          android: 'serif',
          default: "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif",
        }),
        mono: platformSelect({
          ios: 'Menlo',
          android: 'monospace',
          default: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }),
      },
    },
  },
  plugins: [],
};
