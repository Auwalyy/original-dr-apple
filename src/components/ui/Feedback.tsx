import { CircleAlert, CircleCheck, LucideIcon } from 'lucide-react-native';
import React, { createContext, useContext, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { haptics } from '@/lib/haptics';

import { Sheet } from './Sheet';
import { colors, shadows } from './theme';

export interface ActionOption {
  label: string;
  icon?: LucideIcon;
  destructive?: boolean;
  onPress: () => void;
}

interface ActionSheetConfig {
  title?: string;
  message?: string;
  options: ActionOption[];
}

interface FeedbackContextValue {
  /** Short confirmation pill at the top of the screen. */
  toast: (message: string, tone?: 'success' | 'error') => void;
  /** Cross-platform action sheet (menus, confirmations). */
  showActions: (config: ActionSheetConfig) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toastState, setToastState] = useState<{ id: number; message: string; tone: 'success' | 'error' } | null>(null);
  const [sheet, setSheet] = useState<ActionSheetConfig | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value: FeedbackContextValue = {
    toast: (message, tone = 'success') => {
      if (tone === 'success') haptics.success();
      else haptics.warning();
      if (timer.current) clearTimeout(timer.current);
      setToastState({ id: Date.now(), message, tone });
      timer.current = setTimeout(() => setToastState(null), 2200);
    },
    showActions: (config) => {
      haptics.light();
      setSheet(config);
    },
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {toastState && (
        <Animated.View
          key={toastState.id}
          entering={FadeInUp.duration(220)}
          exiting={FadeOutUp.duration(180)}
          pointerEvents="none"
          style={{ position: 'absolute', top: insets.top + 8, left: 16, right: 16, alignItems: 'center', zIndex: 100 }}
        >
          <View className="flex-row items-center gap-2 rounded-full bg-ink px-4 py-3" style={shadows.raised}>
            {toastState.tone === 'success' ? (
              <CircleCheck size={18} color="#fff" />
            ) : (
              <CircleAlert size={18} color="#fff" />
            )}
            <Text className="text-subhead font-semibold text-white">{toastState.message}</Text>
          </View>
        </Animated.View>
      )}

      <Sheet visible={!!sheet} onClose={() => setSheet(null)}>
        {sheet && (
          <View>
            {(sheet.title || sheet.message) && (
              <View className="items-center px-4 pb-4 pt-1">
                {!!sheet.title && (
                  <Text className="text-center text-headline font-semibold text-ink">{sheet.title}</Text>
                )}
                {!!sheet.message && (
                  <Text className="mt-1 text-center text-subhead text-secondary">{sheet.message}</Text>
                )}
              </View>
            )}
            <View className="overflow-hidden rounded-2xl bg-fill">
              {sheet.options.map((opt, i) => {
                const Icon = opt.icon;
                return (
                  <Pressable
                    key={opt.label}
                    onPress={() => {
                      setSheet(null);
                      // Let the sheet close before running actions that open new UI.
                      setTimeout(opt.onPress, 250);
                    }}
                    className={`min-h-[54px] flex-row items-center gap-3 px-4 ${i > 0 ? 'border-t border-separator' : ''}`}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                  >
                    {Icon && <Icon size={20} color={opt.destructive ? colors.danger : colors.ink} />}
                    <Text className={`text-headline ${opt.destructive ? 'text-danger' : 'text-ink'}`}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              onPress={() => setSheet(null)}
              className="mt-3 h-[54px] items-center justify-center rounded-2xl bg-fill"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text className="text-headline font-semibold text-ink">Cancel</Text>
            </Pressable>
          </View>
        )}
      </Sheet>
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used inside <FeedbackProvider>');
  return ctx;
}
