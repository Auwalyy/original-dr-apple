import { Image as ExpoImage } from 'expo-image';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Apple } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import React, { useEffect } from 'react';
import { Platform, Pressable, PressableProps, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// Let NativeWind `className` style third-party components.
cssInterop(ExpoImage, { className: 'style' });
cssInterop(ExpoLinearGradient, { className: 'style' });

export const Img = ExpoImage;
export const Gradient = ExpoLinearGradient;

/** The black rounded square with the Apple mark used across the site. */
export function BrandMark({ size = 36, radius = 12 }: { size?: number; radius?: number }) {
  return (
    <View
      className="items-center justify-center bg-black"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {Platform.OS === 'ios' ? (
        <Text className="font-serif font-black text-white" style={{ fontSize: size * 0.55 }}>
          {''}
        </Text>
      ) : (
        <Apple size={size * 0.5} color="#fff" fill="#fff" />
      )}
    </View>
  );
}

/** Tailwind `animate-ping` equivalent. */
export function Ping({ size = 6 }: { size?: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.bezier(0, 0, 0.2, 1) }), -1);
  }, [progress]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value }],
    opacity: 1 - progress.value,
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View
        style={[
          { position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: '#000' },
          ringStyle,
        ]}
      />
      <View className="bg-black" style={{ width: size, height: size, borderRadius: size / 2 }} />
    </View>
  );
}

/**
 * framer-motion `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` equivalent.
 * className goes on an inner View so NativeWind never styles a Reanimated component directly.
 */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(800).delay(delay)}>
      <View className={className}>{children}</View>
    </Animated.View>
  );
}

/** Pressable with the web `active:scale-95` feel. */
export function PressableScale({ className, style, ...props }: PressableProps & { className?: string }) {
  return (
    <Pressable
      className={className}
      style={(state) => [
        { transform: [{ scale: state.pressed ? 0.97 : 1 }], opacity: state.pressed ? 0.9 : 1 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text className="mb-1 text-xs font-semibold text-neutral-700">{children}</Text>;
}

export function Input({ className = '', ...props }: TextInputProps & { className?: string }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <TextInput
      placeholderTextColor="#737373"
      className={`rounded-xl border bg-neutral-50 px-3.5 py-2.5 text-xs text-black ${
        focused ? 'border-black' : 'border-neutral-300'
      } ${className}`}
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
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <Pressable className="flex-row items-center gap-2" onPress={() => onChange(!checked)}>
      <View
        className={`h-4 w-4 items-center justify-center rounded border ${
          checked ? 'border-black bg-black' : 'border-neutral-300 bg-neutral-100'
        }`}
      >
        {checked && <Text className="text-[10px] font-bold text-white">✓</Text>}
      </View>
      <Text className="text-xs font-semibold text-neutral-800">{label}</Text>
    </Pressable>
  );
}

/** Small uppercase mono pill used for section eyebrows. */
export function Eyebrow({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-2">
      {icon}
      <Text className="font-mono text-xs uppercase tracking-[1.5px] text-neutral-600">{children}</Text>
    </View>
  );
}
