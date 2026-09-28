import { Home, MessageSquare, RefreshCw, Smartphone } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/primitives';
import { openWhatsApp } from '@/lib/utils';

interface MobileDockProps {
  onHome: () => void;
  onPhones: () => void;
  onOpenSwapModal: () => void;
  whatsappPhone: string;
}

/** iPhone-style bottom tab dock from the website's mobile layout. */
export function MobileDock({ onHome, onPhones, onOpenSwapModal, whatsappPhone }: MobileDockProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 px-4 pt-2"
      style={{
        paddingBottom: Math.max(insets.bottom, 8) + 6,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <View className="w-full max-w-md flex-row items-center justify-around self-center">
        <DockItem icon={<Home size={20} color="#000" />} label="Home" onPress={onHome} />
        <DockItem icon={<Smartphone size={20} color="#000" />} label="Phones" onPress={onPhones} />

        <PressableScale
          onPress={onOpenSwapModal}
          accessibilityLabel="Kano Swap Calculator"
          className="-mt-5 h-11 w-11 items-center justify-center rounded-full border border-black bg-black shadow-lg"
        >
          <RefreshCw size={20} color="#fff" />
        </PressableScale>

        <DockItem
          icon={<MessageSquare size={20} color="#000" fill="#000" />}
          label="Order"
          onPress={() =>
            openWhatsApp(whatsappPhone, "Hello Dr Apple Kano, I'd like to inquire about phone inventory.")
          }
        />
      </View>
    </View>
  );
}

function DockItem({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="items-center gap-1 px-3 py-1 active:scale-95">
      {icon}
      <Text className="text-[10px] font-semibold tracking-tight text-black">{label}</Text>
    </Pressable>
  );
}
