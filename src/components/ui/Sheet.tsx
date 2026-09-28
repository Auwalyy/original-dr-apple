import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Fraction of the screen height the sheet may use (web: max-h-[90vh]). */
  maxHeight?: `${number}%`;
  scroll?: boolean;
}

/**
 * Bottom sheet matching the website's mobile modals:
 * `bg-black/60` backdrop, `rounded-t-3xl` white panel sliding up from the bottom.
 */
export function Sheet({ visible, onClose, children, maxHeight = '90%', scroll = true }: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/60"
      >
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityLabel="Close" />
        <Animated.View
          entering={SlideInDown.duration(320)}
          style={{
            width: '100%',
            maxHeight,
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderColor: '#d4d4d4',
          }}
        >
          {scroll ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 24, paddingBottom: 24 + insets.bottom }}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={{ padding: 24, paddingBottom: 24 + insets.bottom }}>{children}</View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
