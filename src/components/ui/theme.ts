import { ViewStyle } from 'react-native';

/** JS mirror of the tailwind.config.js palette, for icon colours and native props. */
export const colors = {
  ink: '#0A0A0A',
  secondary: '#6B6B6B',
  tertiary: '#A1A1A1',
  canvas: '#F5F5F7',
  fill: '#F1F1F3',
  separator: '#E5E5EA',
  white: '#FFFFFF',
  success: '#16A34A',
  warning: '#C2410C',
  danger: '#DC2626',
} as const;

/**
 * Shadows are applied through `style` rather than `shadow-*` classes: NativeWind remounts a view
 * whose shadow class toggles at runtime, which breaks the navigation context.
 */
export const shadows = {
  card: { boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.05)' },
  raised: { boxShadow: '0 6px 24px rgba(0,0,0,0.10)' },
  floating: { boxShadow: '0 2px 10px rgba(0,0,0,0.15)' },
  bar: { boxShadow: '0 -1px 0 rgba(0,0,0,0.06)' },
} satisfies Record<string, ViewStyle>;
