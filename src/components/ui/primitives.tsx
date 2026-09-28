import { Image as ExpoImage } from 'expo-image';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Apple, ChevronRight, LucideIcon, Search, X } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { haptics } from '@/lib/haptics';

import { colors, shadows } from './theme';

// Let NativeWind `className` style third-party components.
cssInterop(ExpoImage, { className: 'style' });
cssInterop(ExpoLinearGradient, { className: 'style' });

export const Img = ExpoImage;
export const Gradient = ExpoLinearGradient;

/* ------------------------------------------------------------------------------------------------
 * Brand
 * ---------------------------------------------------------------------------------------------- */

/** Black rounded square with the Apple mark. */
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <View
      className="items-center justify-center bg-ink"
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
    >
      {Platform.OS === 'ios' ? (
        <Text className="text-white" style={{ fontSize: size * 0.55, marginTop: -size * 0.06 }}>
          {''}
        </Text>
      ) : (
        <Apple size={size * 0.5} color="#fff" fill="#fff" />
      )}
    </View>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Buttons
 * ---------------------------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'inverse' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_VARIANTS: Record<ButtonVariant, { box: string; text: string; icon: string }> = {
  primary: { box: 'bg-ink', text: 'text-white', icon: colors.white },
  secondary: { box: 'bg-fill', text: 'text-ink', icon: colors.ink },
  outline: { box: 'border border-separator bg-white', text: 'text-ink', icon: colors.ink },
  ghost: { box: '', text: 'text-ink', icon: colors.ink },
  danger: { box: 'bg-red-50', text: 'text-danger', icon: colors.danger },
  inverse: { box: 'bg-white', text: 'text-ink', icon: colors.ink },
  glass: { box: 'border border-white/30 bg-white/15', text: 'text-white', icon: colors.white },
};

const BUTTON_SIZES: Record<ButtonSize, { box: string; text: string; icon: number }> = {
  sm: { box: 'h-9 rounded-full px-4', text: 'text-subhead font-semibold', icon: 15 },
  md: { box: 'h-12 rounded-2xl px-5', text: 'text-body font-semibold', icon: 18 },
  lg: { box: 'h-14 rounded-2xl px-6', text: 'text-headline font-semibold', icon: 20 },
};

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconFill?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconFill,
  loading,
  disabled,
  className = '',
  onPress,
  ...props
}: ButtonProps) {
  const v = BUTTON_VARIANTS[variant];
  const s = BUTTON_SIZES[size];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={(e) => {
        haptics.light();
        onPress?.(e);
      }}
      className={`flex-row items-center justify-center gap-2 ${s.box} ${v.box} ${className}`}
      style={({ pressed }) => ({ opacity: inactive ? 0.4 : pressed ? 0.8 : 1 })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.icon} />
      ) : (
        Icon && <Icon size={s.icon} color={v.icon} fill={iconFill ? v.icon : 'none'} strokeWidth={2} />
      )}
      <Text className={`${s.text} ${v.text}`} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

type IconButtonVariant = 'plain' | 'filled' | 'glass' | 'dark';

interface IconButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  icon: LucideIcon;
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  size?: number;
  iconSize?: number;
  className?: string;
}

export function IconButton({
  icon: Icon,
  variant = 'filled',
  size = 40,
  iconSize = 20,
  className = '',
  onPress,
  ...props
}: IconButtonProps) {
  const box = { plain: '', filled: 'bg-fill', glass: 'bg-white/95', dark: 'bg-ink' }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={6}
      onPress={(e) => {
        haptics.selection();
        onPress?.(e);
      }}
      className={`items-center justify-center rounded-full ${box} ${className}`}
      style={({ pressed }) => [
        { width: size, height: size, opacity: pressed ? 0.7 : 1 },
        variant === 'glass' ? shadows.floating : null,
      ]}
      {...props}
    >
      <Icon size={iconSize} color={variant === 'dark' ? colors.white : colors.ink} strokeWidth={2} />
    </Pressable>
  );
}

/** Text button for native stack headers ("Save", "Cancel"). */
export function HeaderButton({
  title,
  onPress,
  disabled,
  bold = true,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  bold?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={10} className="px-1">
      <Text className={`text-headline ${bold ? 'font-semibold' : ''} ${disabled ? 'text-tertiary' : 'text-ink'}`}>
        {title}
      </Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Selection
 * ---------------------------------------------------------------------------------------------- */

export function Chip({
  label,
  selected,
  onPress,
  count,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  count?: number;
}) {
  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`h-9 flex-row items-center gap-1.5 rounded-full px-4 ${selected ? 'bg-ink' : 'bg-fill'}`}
    >
      <Text className={`text-subhead font-semibold ${selected ? 'text-white' : 'text-ink'}`}>{label}</Text>
      {count !== undefined && (
        <Text className={`text-subhead ${selected ? 'text-white/60' : 'text-tertiary'}`}>{count}</Text>
      )}
    </Pressable>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Inputs
 * ---------------------------------------------------------------------------------------------- */

interface TextFieldProps extends TextInputProps {
  label?: string;
  helper?: string;
  error?: string;
  icon?: LucideIcon;
}

export function TextField({ label, helper, error, icon: Icon, multiline, style, ...props }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View className="gap-1.5">
      {!!label && <Text className="text-subhead font-medium text-secondary">{label}</Text>}
      <View
        className={`flex-row rounded-xl border bg-fill px-4 ${multiline ? 'min-h-[96px] items-start py-3' : 'h-12 items-center'} ${
          error ? 'border-danger' : focused ? 'border-ink' : 'border-transparent'
        }`}
      >
        {Icon && (
          <View className={multiline ? 'mr-3 pt-0.5' : 'mr-3'}>
            <Icon size={18} color={colors.tertiary} />
          </View>
        )}
        <TextInput
          placeholderTextColor={colors.tertiary}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          className="flex-1 text-body text-ink"
          style={[{ paddingVertical: 0 }, style]}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {!!(error || helper) && (
        <Text className={`text-caption ${error ? 'text-danger' : 'text-secondary'}`}>{error || helper}</Text>
      )}
    </View>
  );
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  autoFocus,
  onFocus,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
}) {
  return (
    <View className="h-11 flex-row items-center gap-2 rounded-xl bg-fill px-3">
      <Search size={18} color={colors.secondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        autoFocus={autoFocus}
        onFocus={onFocus}
        returnKeyType="search"
        autoCorrect={false}
        className="flex-1 text-body text-ink"
        style={{ paddingVertical: 0 }}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Clear search">
          <View className="h-5 w-5 items-center justify-center rounded-full bg-tertiary">
            <X size={12} color="#fff" strokeWidth={3} />
          </View>
        </Pressable>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Layout
 * ---------------------------------------------------------------------------------------------- */

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  className = '',
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <View className={`flex-row items-end justify-between px-5 ${className}`}>
      <Text className="text-title3 font-bold tracking-tight text-ink">{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text className="text-body font-medium text-secondary">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

/** Grouped, inset list in the style of iOS Settings. */
export function ListSection({
  title,
  footer,
  children,
  inset = 16,
}: {
  title?: string;
  footer?: string;
  children: React.ReactNode;
  /** Left inset of separators (use 60 when rows have icons). */
  inset?: number;
}) {
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <View className="gap-2">
      {!!title && <Text className="px-4 text-subhead font-medium uppercase tracking-wide text-secondary">{title}</Text>}
      <View className="overflow-hidden rounded-2xl bg-white" style={shadows.card}>
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View className="h-px bg-separator" style={{ marginLeft: inset }} />}
            {row}
          </React.Fragment>
        ))}
      </View>
      {!!footer && <Text className="px-4 text-caption text-secondary">{footer}</Text>}
    </View>
  );
}

export function ListRow({
  icon: Icon,
  title,
  subtitle,
  value,
  right,
  onPress,
  destructive,
  chevron = !!onPress,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  value?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  chevron?: boolean;
}) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        haptics.selection();
        onPress?.();
      }}
      className="min-h-[52px] flex-row items-center gap-3 px-4 py-3"
      style={({ pressed }) => ({ backgroundColor: pressed ? colors.fill : colors.white })}
    >
      {Icon && (
        <View className={`h-8 w-8 items-center justify-center rounded-lg ${destructive ? 'bg-red-50' : 'bg-ink'}`}>
          <Icon size={17} color={destructive ? colors.danger : colors.white} />
        </View>
      )}
      <View className="flex-1">
        <Text className={`text-body font-medium ${destructive ? 'text-danger' : 'text-ink'}`}>{title}</Text>
        {!!subtitle && <Text className="mt-0.5 text-subhead text-secondary">{subtitle}</Text>}
      </View>
      {!!value && <Text className="text-body text-secondary">{value}</Text>}
      {right}
      {chevron && <ChevronRight size={18} color={colors.tertiary} />}
    </Pressable>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center px-8 py-16">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-fill">
        <Icon size={28} color={colors.secondary} />
      </View>
      <Text className="text-center text-headline font-semibold text-ink">{title}</Text>
      {!!message && <Text className="mt-1 text-center text-body text-secondary">{message}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} variant="secondary" size="sm" onPress={onAction} className="mt-5" />
      )}
    </View>
  );
}

/** Solid strip behind the status bar so scrolled content never collides with the clock. */
export function StatusBarBackdrop({ height }: { height: number }) {
  return <View pointerEvents="none" className="absolute left-0 right-0 top-0 z-50 bg-white/95" style={{ height }} />;
}
