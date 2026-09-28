import { Stack } from 'expo-router';
import React, { useState } from 'react';

import { AdminScreen } from '@/components/admin/AdminScreen';
import { FormSection } from '@/components/admin/FormSection';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useFeedback } from '@/components/ui/Feedback';
import { HeaderButton, TextField } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { SwapProgramContent } from '@/lib/types';

const STEPS = [
  { title: 'step1_title', desc: 'step1_desc' },
  { title: 'step2_title', desc: 'step2_desc' },
  { title: 'step3_title', desc: 'step3_desc' },
] as const;

export default function AdminSwapProgramScreen() {
  const { swapProgram, saveSwapProgram } = useCMS();
  const { toast } = useFeedback();
  const [content, setContent] = useState<SwapProgramContent>(swapProgram);

  const dirty = JSON.stringify(content) !== JSON.stringify(swapProgram);
  const set = (key: keyof SwapProgramContent, value: string) => setContent((c) => ({ ...c, [key]: value }));

  const save = () => {
    saveSwapProgram(content);
    toast('Swap content updated');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <HeaderButton title="Save" onPress={save} disabled={!dirty || !content.title.trim()} />,
        }}
      />
      <AdminScreen>
        <FormSection title="Store photo" footer="Shown on the Store tab.">
          <ImageUploader
            value={content.pinned_image_url}
            onChange={(url) => set('pinned_image_url', url)}
            aspect={16 / 9}
          />
        </FormSection>

        <FormSection title="Introduction">
          <TextField label="Title" value={content.title} onChangeText={(t) => set('title', t)} />
          <TextField label="Summary" multiline value={content.subtitle} onChangeText={(t) => set('subtitle', t)} />
        </FormSection>

        {STEPS.map((step, i) => (
          <FormSection key={step.title} title={`Step ${i + 1}`}>
            <TextField label="Title" value={content[step.title]} onChangeText={(t) => set(step.title, t)} />
            <TextField
              label="Description"
              multiline
              value={content[step.desc]}
              onChangeText={(t) => set(step.desc, t)}
            />
          </FormSection>
        ))}

        <FormSection title="Guarantee" footer="Shown on Home, Swap and Store.">
          <TextField
            multiline
            value={content.valuation_guarantee_text}
            onChangeText={(t) => set('valuation_guarantee_text', t)}
          />
        </FormSection>
      </AdminScreen>
    </>
  );
}
