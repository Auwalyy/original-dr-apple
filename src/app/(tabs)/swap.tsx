import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { Check, ChevronDown, Info, MessageCircle, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { OptionSheet, Select } from '@/components/ui/Select';
import { Button, Chip, Img, TextField } from '@/components/ui/primitives';
import { LargeTitle, TabScrollView } from '@/components/ui/Screen';
import { colors } from '@/components/ui/theme';
import { haptics } from '@/lib/haptics';
import { useCMS } from '@/lib/store';
import { BASE_VALUATIONS, buildSwapRequestText, estimateTradeInValue, STORAGE_OPTIONS } from '@/lib/swap';
import { PhysicalCondition } from '@/lib/types';
import { formatNaira, openWhatsApp } from '@/lib/utils';

const CONDITIONS: { value: PhysicalCondition; title: string; description: string }[] = [
  { value: 'Pristine', title: 'Pristine', description: 'No scratches, looks brand new' },
  { value: 'Good', title: 'Good', description: 'Light wear, clean screen' },
  { value: 'Minor Scratches', title: 'Minor scratches', description: 'Noticeable scuffs on body or screen' },
  { value: 'Cracked Screen', title: 'Cracked / faulty', description: 'Cracked glass or a defect' },
];

export default function SwapScreen() {
  const { products, settings, swapProgram } = useCMS();
  const { target } = useLocalSearchParams<{ target?: string }>();
  const phones = products.filter((p) => p.is_published && p.category !== 'accessories');

  const [model, setModel] = useState('iPhone 13');
  const [storage, setStorage] = useState('128GB');
  const [battery, setBattery] = useState(88);
  const [condition, setCondition] = useState<PhysicalCondition>('Good');
  const [targetId, setTargetId] = useState(target || phones[0]?.id || '');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [name, setName] = useState('');

  // "Swap" on a product page pre-selects that product, even when this tab is already mounted.
  const [lastTarget, setLastTarget] = useState(target);
  if (target !== lastTarget) {
    setLastTarget(target);
    if (target) setTargetId(target);
  }

  const input = { model, storage, batteryHealth: battery, condition };
  const tradeValue = estimateTradeInValue(input);
  const targetProduct = phones.find((p) => p.id === targetId) ?? phones[0];
  const targetPrice = targetProduct?.price ?? 0;
  const topUp = Math.max(0, targetPrice - tradeValue);
  const cashBack = Math.max(0, tradeValue - targetPrice);

  return (
    <TabScrollView>
      <LargeTitle title="Swap & upgrade" subtitle="Get an instant estimate for your iPhone, then confirm in store." />

      {/* Step 1 */}
      <Step number={1} title="Your current iPhone">
        <Select
          label="Model"
          value={model}
          onChange={setModel}
          options={Object.keys(BASE_VALUATIONS).map((m) => ({ label: m, value: m }))}
        />

        <View className="gap-2">
          <Text className="text-subhead font-medium text-secondary">Storage</Text>
          <View className="flex-row flex-wrap gap-2">
            {STORAGE_OPTIONS.map((s) => (
              <Chip key={s} label={s} selected={storage === s} onPress={() => setStorage(s)} />
            ))}
          </View>
        </View>

        <View className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-subhead font-medium text-secondary">Battery health</Text>
            <Text className="text-headline font-semibold text-ink">{battery}%</Text>
          </View>
          <Slider
            minimumValue={50}
            maximumValue={100}
            step={1}
            value={battery}
            onValueChange={(v) => setBattery(Math.round(v))}
            onSlidingComplete={() => haptics.selection()}
            minimumTrackTintColor={colors.ink}
            maximumTrackTintColor={colors.separator}
            thumbTintColor={colors.ink}
          />
          <Text className="text-caption text-secondary">Settings → Battery → Battery Health on your iPhone</Text>
        </View>

        <View className="gap-2">
          <Text className="text-subhead font-medium text-secondary">Condition</Text>
          {CONDITIONS.map((c) => {
            const selected = condition === c.value;
            return (
              <Pressable
                key={c.value}
                onPress={() => {
                  haptics.selection();
                  setCondition(c.value);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                className={`flex-row items-center gap-3 rounded-2xl border p-4 ${
                  selected ? 'border-ink bg-white' : 'border-separator bg-white'
                }`}
              >
                <View
                  className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-ink bg-ink' : 'border-separator'
                  }`}
                >
                  {selected && <Check size={12} color="#fff" strokeWidth={3} />}
                </View>
                <View className="flex-1">
                  <Text className="text-body font-semibold text-ink">{c.title}</Text>
                  <Text className="text-subhead text-secondary">{c.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Step>

      {/* Step 2 */}
      <Step number={2} title="Upgrade to">
        {targetProduct ? (
          <Pressable
            onPress={() => {
              haptics.selection();
              setPickerOpen(true);
            }}
            className="flex-row items-center gap-3 rounded-2xl bg-fill p-3"
          >
            <Img
              source={{ uri: targetProduct.image_url }}
              className="h-16 w-16 rounded-xl bg-white"
              contentFit="cover"
            />
            <View className="flex-1">
              <Text className="text-body font-semibold text-ink" numberOfLines={2}>
                {targetProduct.name}
              </Text>
              <Text className="mt-0.5 text-body text-secondary">{formatNaira(targetProduct.price)}</Text>
            </View>
            <View className="flex-row items-center gap-1 pr-1">
              <Text className="text-subhead font-semibold text-ink">Change</Text>
              <ChevronDown size={16} color={colors.ink} />
            </View>
          </Pressable>
        ) : (
          <Text className="text-body text-secondary">No phones are available right now.</Text>
        )}
      </Step>

      {/* Estimate */}
      <View className="mx-5 mt-8 rounded-3xl bg-ink p-6">
        <Text className="text-subhead font-medium text-white/60">Estimated trade-in value</Text>
        <Text className="mt-1 font-serif text-[36px] font-bold leading-[42px] text-white">
          {formatNaira(tradeValue)}
        </Text>

        <View className="mt-5 gap-2.5 border-t border-white/15 pt-4">
          <Line label={targetProduct ? targetProduct.name : 'Upgrade price'} value={formatNaira(targetPrice)} />
          <Line label="Your trade-in" value={`− ${formatNaira(tradeValue)}`} />
        </View>
        <View className="mt-3 flex-row items-center justify-between border-t border-white/15 pt-4">
          <Text className="text-headline font-semibold text-white">{cashBack > 0 ? 'We pay you' : 'You pay'}</Text>
          <Text className="text-title3 font-bold text-white">{formatNaira(cashBack > 0 ? cashBack : topUp)}</Text>
        </View>
      </View>

      <View className="mx-5 mt-3 flex-row gap-2 px-1">
        <Info size={14} color={colors.secondary} style={{ marginTop: 2 }} />
        <Text className="flex-1 text-caption text-secondary">
          Final value is confirmed after a free inspection at {settings.store_address}.{' '}
          {swapProgram.valuation_guarantee_text}
        </Text>
      </View>

      {/* Send */}
      <View className="mx-5 mt-8 gap-4">
        <TextField
          label="Your name"
          icon={User}
          placeholder="e.g. Ibrahim Musa"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="done"
        />
        <Button
          title="Book inspection on WhatsApp"
          size="lg"
          icon={MessageCircle}
          disabled={!targetProduct}
          onPress={() =>
            openWhatsApp(
              settings.contact_whatsapp,
              buildSwapRequestText(input, name.trim(), tradeValue, targetProduct, topUp),
            )
          }
        />
      </View>

      <OptionSheet
        visible={pickerOpen}
        title="Upgrade to"
        value={targetId}
        onChange={setTargetId}
        onClose={() => setPickerOpen(false)}
        options={phones.map((p) => ({
          value: p.id,
          label: p.name,
          description: formatNaira(p.price),
          image: p.image_url,
        }))}
      />
    </TabScrollView>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <View className="mt-7 px-5">
      <View className="mb-4 flex-row items-center gap-2.5">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-ink">
          <Text className="text-subhead font-bold text-white">{number}</Text>
        </View>
        <Text className="text-title3 font-bold text-ink">{title}</Text>
      </View>
      <View className="gap-5">{children}</View>
    </View>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="flex-1 text-body text-white/70" numberOfLines={1}>
        {label}
      </Text>
      <Text className="text-body font-medium text-white">{value}</Text>
    </View>
  );
}
