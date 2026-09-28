import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import { Cloud, CloudOff, Copy, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { AdminScreen } from '@/components/admin/AdminScreen';
import { useFeedback } from '@/components/ui/Feedback';
import { IconButton, Img } from '@/components/ui/primitives';
import { colors, shadows } from '@/components/ui/theme';
import { useCMS } from '@/lib/store';
import { isSupabaseConfigured, uploadImageToStorage } from '@/lib/supabase';

const GAP = 6;

export default function AdminMediaScreen() {
  const { media, addMedia } = useCMS();
  const { toast, showActions } = useFeedback();
  const { width } = useWindowDimensions();
  const [uploading, setUploading] = useState(false);
  const tile = (width - 32 - GAP * 2) / 3;

  const upload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setUploading(true);
    try {
      addMedia(
        isSupabaseConfigured ? await uploadImageToStorage(asset.uri, asset.mimeType ?? 'image/jpeg') : asset.uri,
      );
      toast('Photo added');
    } catch (err) {
      console.error(err);
      toast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const openAsset = (url: string) =>
    showActions({
      options: [
        {
          label: 'Copy image link',
          icon: Copy,
          onPress: async () => {
            await Clipboard.setStringAsync(url);
            toast('Link copied');
          },
        },
      ],
    });

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            uploading ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <IconButton icon={Plus} accessibilityLabel="Upload photo" size={34} onPress={upload} />
            ),
        }}
      />
      <AdminScreen contentContainerStyle={{ gap: 20 }}>
        <View className="flex-row items-center gap-3 rounded-2xl bg-white p-4" style={shadows.card}>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-fill">
            {isSupabaseConfigured ? <Cloud size={20} color={colors.ink} /> : <CloudOff size={20} color={colors.ink} />}
          </View>
          <View className="flex-1">
            <Text className="text-body font-semibold text-ink">
              {isSupabaseConfigured ? 'Supabase Storage connected' : 'Saving on this device'}
            </Text>
            <Text className="text-subhead text-secondary">
              {isSupabaseConfigured
                ? 'Uploads go to the dr-apple-assets bucket.'
                : 'Add Supabase keys to share uploads across devices.'}
            </Text>
          </View>
        </View>

        <View>
          <Text className="mb-2 px-1 text-subhead text-secondary">
            {media.length} {media.length === 1 ? 'photo' : 'photos'}
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: GAP }}>
            {media.map((url) => (
              <Pressable
                key={url}
                onPress={() => openAsset(url)}
                accessibilityLabel="Photo options"
                style={({ pressed }) => ({ width: tile, height: tile, opacity: pressed ? 0.7 : 1 })}
              >
                <Img source={{ uri: url }} className="h-full w-full rounded-lg bg-fill" contentFit="cover" />
              </Pressable>
            ))}
          </View>
        </View>
      </AdminScreen>
    </>
  );
}
