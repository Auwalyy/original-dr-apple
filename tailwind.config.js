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
          web: "Georgia, Cambria, 'Times New Roman', Times, serif",
          default: 'serif',
        }),
        mono: platformSelect({
          ios: 'Menlo',
          android: 'monospace',
          web: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          default: 'monospace',
        }),
      },
    },
  },
  plugins: [],
};
