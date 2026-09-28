import { X } from 'lucide-react-native';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from './primitives';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: `${number}%`;
}

/** Bottom sheet with grab handle, optional title bar and a dimmed, tappable backdrop. */
export function Sheet({ visible, onClose, title, children, maxHeight = '85%' }: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityLabel="Dismiss" />
        <Animated.View
          entering={SlideInDown.duration(280)}
          style={{
            width: '100%',
            maxHeight,
            backgroundColor: '#fff',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
        >
          <View className="items-center pb-1 pt-2.5">
            <View className="h-1.5 w-10 rounded-full bg-separator" />
          </View>

          {!!title && (
            <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
              <Text className="flex-1 text-headline font-semibold text-ink">{title}</Text>
              <IconButton icon={X} accessibilityLabel="Close" size={32} iconSize={16} onPress={onClose} />
            </View>
          )}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 + insets.bottom }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
