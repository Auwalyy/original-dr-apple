import * as ImagePicker from 'expo-image-picker';
import { Check, Loader2, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { Img } from '@/components/ui/primitives';
import { isSupabaseConfigured, uploadImageToStorage } from '@/lib/supabase';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = 'Product Image / Banner Asset' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [message, setMessage] = useState('');

  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    setUploading(true);
    setMessage('');
    try {
      if (isSupabaseConfigured) {
        const url = await uploadImageToStorage(asset.uri, asset.mimeType ?? 'image/jpeg');
        onChange(url);
        setMessage('Image successfully stored in Supabase Cloud Storage bucket!');
      } else {
        onChange(asset.uri);
        setMessage('Image loaded successfully (Local Device Mode)');
      }
    } catch (err) {
      console.error(err);
      onChange(asset.uri);
      setMessage(`Upload error: ${err instanceof Error ? err.message : 'Using local file'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleApplyUrl = () => {
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setManualUrl('');
    setMessage('URL applied successfully!');
  };

  return (
    <View className="gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <View className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-black">{label}</Text>
        <View className="flex-row items-center gap-1 self-start rounded-lg border border-neutral-300 bg-white p-0.5">
          {(['upload', 'url'] as const).map((m) => (
            <Pressable key={m} onPress={() => setMode(m)} className={`rounded px-2.5 py-1 ${mode === m ? 'bg-black' : ''}`}>
              <Text className={`text-[11px] ${mode === m ? 'font-bold text-white' : 'font-medium text-neutral-600'}`}>
                {m === 'upload' ? 'Upload File' : 'Paste URL'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {mode === 'upload' ? (
        <Pressable
          onPress={handlePick}
          disabled={uploading}
          className="items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-white p-6"
        >
          {uploading ? <ActivityIndicator color="#000" /> : <Upload size={32} color="rgba(0,0,0,0.8)" />}
          <Text className="text-xs font-semibold text-black">
            {uploading ? 'Storing in Supabase Cloud Storage...' : 'Tap to choose an image from your device'}
          </Text>
          <Text className="font-mono text-[10px] text-neutral-500">PNG, JPG, WEBP up to 10MB</Text>
        </Pressable>
      ) : (
        <View className="flex-row gap-2">
          <TextInput
            placeholder="https://images.unsplash.com/..."
            placeholderTextColor="#737373"
            autoCapitalize="none"
            keyboardType="url"
            value={manualUrl}
            onChangeText={setManualUrl}
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-black"
          />
          <Pressable onPress={handleApplyUrl} className="justify-center rounded-lg bg-black px-4 py-2">
            <Text className="text-xs font-bold text-white">Apply</Text>
          </Pressable>
        </View>
      )}

      {!!value && (
        <View className="flex-row items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
          <View className="h-16 w-16 overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100">
            <Img source={{ uri: value }} className="h-full w-full" contentFit="cover" />
          </View>
          <View className="flex-1">
            <Text className="font-mono text-xs text-black" numberOfLines={1}>
              {value}
            </Text>
            <View className="mt-1 flex-row items-center gap-1">
              <Check size={12} color="#000" />
              <Text className="text-[10px] font-semibold text-black">Image Active & Ready</Text>
            </View>
          </View>
        </View>
      )}

      {!!message && <Text className="font-mono text-[11px] text-black">{message}</Text>}
    </View>
  );
}
