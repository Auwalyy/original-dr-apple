import * as Clipboard from 'expo-clipboard';
import { Check, Cloud, Copy } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AdminShell, Panel } from '@/components/admin/AdminShell';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Img } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminMediaScreen() {
  const { media, addMedia } = useCMS();
  const [currentUpload, setCurrentUpload] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  const copy = async (url: string) => {
    await Clipboard.setStringAsync(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  return (
    <AdminShell title="Supabase Cloud Storage Media Manager">
      {/* Cloud status */}
      <View className="gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-black">
            <Cloud size={24} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="font-serif text-lg font-bold text-black">
              Bucket: <Text className="font-mono font-extrabold">dr-apple-assets</Text>
            </Text>
            <Text className="text-xs text-neutral-600">
              {isSupabaseConfigured
                ? 'Connected to Supabase PostgreSQL & Cloud Storage'
                : 'Local Preview & Direct Storage Fallback Active'}
            </Text>
          </View>
        </View>
        <View className="self-start rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1">
          <Text className="font-mono text-xs font-bold text-black">
            {isSupabaseConfigured ? 'Supabase Live' : 'Storage Engine Ready'}
          </Text>
        </View>
      </View>

      {/* Uploader */}
      <Panel>
        <Text className="font-serif text-base font-bold text-black">Upload Asset to Cloud Storage</Text>
        <ImageUploader
          value={currentUpload}
          onChange={(url) => {
            setCurrentUpload(url);
            addMedia(url);
          }}
          label="Select file to upload to dr-apple-assets bucket"
        />
      </Panel>

      {/* Gallery */}
      <View className="gap-4">
        <Text className="font-serif text-lg font-bold text-black">Uploaded Assets Gallery ({media.length})</Text>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {media.map((url) => (
            <View key={url} className="w-[48%] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
              <Img source={{ uri: url }} className="aspect-square w-full bg-neutral-100" contentFit="cover" />
              <View className="flex-row items-center justify-between gap-2 border-t border-neutral-200 bg-neutral-50 p-3">
                <Text className="flex-1 font-mono text-[10px] text-neutral-600" numberOfLines={1}>
                  {url}
                </Text>
                <Pressable
                  onPress={() => copy(url)}
                  accessibilityLabel="Copy URL reference"
                  className="rounded-lg border border-neutral-300 bg-neutral-100 p-1.5"
                >
                  {copiedUrl === url ? <Check size={14} color="#000" /> : <Copy size={14} color="#000" />}
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>
    </AdminShell>
  );
}
