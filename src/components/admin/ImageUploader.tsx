import * as ImagePicker from 'expo-image-picker';
import { ImagePlus, Link2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useFeedback } from '@/components/ui/Feedback';
import { Button, Img, TextField } from '@/components/ui/primitives';
import { colors } from '@/components/ui/theme';
import { isSupabaseConfigured, uploadImageToStorage } from '@/lib/supabase';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  /** Preview aspect ratio (width / height). */
  aspect?: number;
}

/** Image preview with "Choose photo" (device library → Supabase Storage when configured) or "Use link". */
export function ImageUploader({ value, onChange, aspect = 4 / 3 }: ImageUploaderProps) {
  const { toast } = useFeedback();
  const [uploading, setUploading] = useState(false);
  const [linkMode, setLinkMode] = useState(false);
  const [link, setLink] = useState('');

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    if (!isSupabaseConfigured) {
      onChange(asset.uri);
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadImageToStorage(asset.uri, asset.mimeType ?? 'image/jpeg'));
      toast('Photo uploaded');
    } catch (err) {
      console.error(err);
      onChange(asset.uri);
      toast('Upload failed — saved on this device only', 'error');
    } finally {
      setUploading(false);
    }
  };

  const applyLink = () => {
    const url = link.trim();
    if (!/^https?:\/\//.test(url)) {
      toast('Enter a full https:// image link', 'error');
      return;
    }
    onChange(url);
    setLink('');
    setLinkMode(false);
  };

  return (
    <View className="gap-3">
      <View className="overflow-hidden rounded-2xl bg-fill" style={{ aspectRatio: aspect }}>
        {value ? (
          <Img source={{ uri: value }} className="h-full w-full" contentFit="cover" transition={200} />
        ) : (
          <View className="flex-1 items-center justify-center gap-2">
            <ImagePlus size={28} color={colors.tertiary} />
            <Text className="text-subhead text-secondary">No photo yet</Text>
          </View>
        )}
        {uploading && (
          <View className="absolute inset-0 items-center justify-center bg-white/70">
            <ActivityIndicator color={colors.ink} />
            <Text className="mt-2 text-subhead font-medium text-ink">Uploading…</Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-3">
        <Button
          title={value ? 'Change photo' : 'Choose photo'}
          variant="secondary"
          icon={ImagePlus}
          className="flex-1"
          disabled={uploading}
          onPress={pick}
        />
        <Button title="Use link" variant="secondary" icon={Link2} onPress={() => setLinkMode((v) => !v)} />
      </View>

      {linkMode && (
        <View className="gap-3">
          <TextField
            placeholder="https://…"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            value={link}
            onChangeText={setLink}
            onSubmitEditing={applyLink}
            autoFocus
          />
          <Button title="Apply link" onPress={applyLink} />
        </View>
      )}
    </View>
  );
}
