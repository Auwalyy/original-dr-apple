const { platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Monochrome brand palette + iOS-style neutrals. Keep in sync with src/components/ui/theme.ts.
      colors: {
        ink: '#0A0A0A',
        secondary: '#6B6B6B',
        tertiary: '#A1A1A1',
        canvas: '#F5F5F7',
        fill: '#F1F1F3',
        separator: '#E5E5EA',
        success: '#16A34A',
        warning: '#C2410C',
        danger: '#DC2626',
      },
      // Type scale (size / line height) modelled on the iOS text styles.
      fontSize: {
        display: ['32px', { lineHeight: '38px' }],
        title: ['24px', { lineHeight: '30px' }],
        title3: ['20px', { lineHeight: '25px' }],
        headline: ['17px', { lineHeight: '22px' }],
        body: ['15px', { lineHeight: '21px' }],
        subhead: ['13px', { lineHeight: '18px' }],
        caption: ['12px', { lineHeight: '16px' }],
      },
      // Serif is reserved for brand display type (Georgia on iOS/web, Noto Serif on Android).
      fontFamily: {
        serif: platformSelect({
          ios: 'Georgia',
          android: 'serif',
          web: "Georgia, Cambria, 'Times New Roman', Times, serif",
          default: 'serif',
        }),
      },
    },
  },
  plugins: [],
};
