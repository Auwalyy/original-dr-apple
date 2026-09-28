import { RefreshCw } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { AdminShell, Panel, PublishButton, SavedBanner } from '@/components/admin/AdminShell';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Input, Label } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { SwapProgramContent } from '@/lib/types';

const STEPS = [
  { title: 'step1_title', desc: 'step1_desc' },
  { title: 'step2_title', desc: 'step2_desc' },
  { title: 'step3_title', desc: 'step3_desc' },
] as const;

export default function AdminSwapProgramScreen() {
  const { swapProgram, saveSwapProgram } = useCMS();
  const [content, setContent] = useState<SwapProgramContent>(swapProgram);
  const [savedMessage, setSavedMessage] = useState('');

  const set = (key: keyof SwapProgramContent, value: string) => setContent((c) => ({ ...c, [key]: value }));

  const handleSave = () => {
    if (!content.title.trim()) return;
    saveSwapProgram(content);
    setSavedMessage('Discovery Split-Screen Swap Program copy published to storefront!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <AdminShell title="Discovery Split-Screen Swap Copy">
      <SavedBanner message={savedMessage} />

      <Panel>
        <View className="gap-3 border-b border-neutral-200 pb-4">
          <View className="flex-row items-center gap-3">
            <RefreshCw size={20} color="#000" />
            <Text className="flex-1 font-serif text-lg font-bold text-black">Discovery Split-Screen Section Copy</Text>
          </View>
          <PublishButton label="Publish Swap Copy" onPress={handleSave} />
        </View>

        <View>
          <Label>Section Title</Label>
          <Input value={content.title} onChangeText={(t) => set('title', t)} className="font-serif text-base" />
        </View>
        <View>
          <Label>Section Narrative Subtitle</Label>
          <Input
            multiline
            textAlignVertical="top"
            value={content.subtitle}
            onChangeText={(t) => set('subtitle', t)}
            className="min-h-[64px]"
          />
        </View>

        <ImageUploader
          value={content.pinned_image_url}
          onChange={(url) => set('pinned_image_url', url)}
          label="Pinned Side Image Asset (Supabase Storage)"
        />

        <View className="gap-4 border-t border-neutral-200 pt-4">
          <Text className="font-mono text-xs font-bold uppercase tracking-[1.2px] text-black">
            Step-by-Step Narrative Breakdown
          </Text>

          {STEPS.map((step) => (
            <View key={step.title} className="gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <Input
                value={content[step.title]}
                onChangeText={(t) => set(step.title, t)}
                className="rounded-lg bg-white px-3 py-2 font-bold"
              />
              <Input
                multiline
                textAlignVertical="top"
                value={content[step.desc]}
                onChangeText={(t) => set(step.desc, t)}
                className="min-h-[64px] rounded-lg bg-white p-3 text-neutral-700"
              />
            </View>
          ))}

          <View>
            <Label>Kano Trade-in Guarantee Statement</Label>
            <Input
              value={content.valuation_guarantee_text}
              onChangeText={(t) => set('valuation_guarantee_text', t)}
            />
          </View>
        </View>

        <PublishButton label="Publish Swap Copy" onPress={handleSave} />
      </Panel>
    </AdminShell>
  );
}
