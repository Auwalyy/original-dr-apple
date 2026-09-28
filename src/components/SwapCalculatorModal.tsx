import { MessageSquare, RefreshCw, ShieldCheck, Smartphone, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Select } from '@/components/ui/Select';
import { Sheet } from '@/components/ui/Sheet';
import {
  BASE_VALUATIONS,
  buildSwapRequestText,
  CONDITION_OPTIONS,
  estimateTradeInValue,
  STORAGE_OPTIONS,
} from '@/lib/swap';
import { PhysicalCondition, Product } from '@/lib/types';
import { formatNaira, openWhatsApp } from '@/lib/utils';

interface SwapCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedTargetProduct?: Product | null;
  whatsappPhone: string;
}

export function SwapCalculatorModal({
  isOpen,
  onClose,
  products,
  selectedTargetProduct = null,
  whatsappPhone,
}: SwapCalculatorModalProps) {
  return (
    <Sheet visible={isOpen} onClose={onClose} maxHeight="92%">
      {/* Remounted per open so the target defaults to the product the user came from */}
      {isOpen && (
        <SwapCalculatorBody
          key={selectedTargetProduct?.id ?? 'none'}
          onClose={onClose}
          products={products}
          selectedTargetProduct={selectedTargetProduct}
          whatsappPhone={whatsappPhone}
        />
      )}
    </Sheet>
  );
}

function SwapCalculatorBody({
  onClose,
  products,
  selectedTargetProduct,
  whatsappPhone,
}: Omit<SwapCalculatorModalProps, 'isOpen'>) {
  const [model, setModel] = useState('iPhone 13');
  const [storage, setStorage] = useState('128GB');
  const [batteryText, setBatteryText] = useState('88');
  const [condition, setCondition] = useState<PhysicalCondition>('Good');
  const [targetId, setTargetId] = useState(selectedTargetProduct?.id || products[0]?.id || '');
  const [customerName, setCustomerName] = useState('');

  const batteryHealth = Number(batteryText) || 0;
  const input = { model, storage, batteryHealth, condition };
  const tradeValue = estimateTradeInValue(input);
  const target = products.find((p) => p.id === targetId) || products[0];
  const targetPrice = target?.price ?? 0;
  const topUp = Math.max(0, targetPrice - tradeValue);

  return (
    <View>
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between border-b border-neutral-200 pb-4">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl border border-black bg-black">
            <RefreshCw size={20} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="font-serif text-lg font-bold text-black">Kano Phone Swap Calculator</Text>
            <Text className="text-xs text-neutral-600">
              Get an instant estimated trade-in valuation for your pre-owned iPhone
            </Text>
          </View>
        </View>
        <Pressable onPress={onClose} className="rounded-full p-2" accessibilityLabel="Close">
          <X size={20} color="#737373" />
        </Pressable>
      </View>

      <View className="gap-6">
        {/* Step 1 */}
        <View className="gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <View className="flex-row items-center gap-1.5">
            <Smartphone size={14} color="#000" />
            <Text className="font-mono text-xs font-bold uppercase tracking-[1.2px] text-black">
              1. Your Current Phone
            </Text>
          </View>

          <View>
            <FieldLabel>Select iPhone Model</FieldLabel>
            <Select
              title="Select iPhone Model"
              value={model}
              onChange={setModel}
              options={Object.keys(BASE_VALUATIONS).map((m) => ({ label: m, value: m }))}
            />
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <FieldLabel>Storage Capacity</FieldLabel>
              <Select
                title="Storage Capacity"
                value={storage}
                onChange={setStorage}
                options={STORAGE_OPTIONS.map((s) => ({ label: s, value: s }))}
              />
            </View>
            <View className="flex-1">
              <FieldLabel>Battery Health (%)</FieldLabel>
              <TextInput
                keyboardType="number-pad"
                maxLength={3}
                value={batteryText}
                onChangeText={(t) => setBatteryText(t.replace(/[^0-9]/g, ''))}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 font-mono text-xs text-black"
              />
            </View>
          </View>

          <View>
            <FieldLabel>Physical Condition</FieldLabel>
            <Select title="Physical Condition" value={condition} onChange={setCondition} options={CONDITION_OPTIONS} />
          </View>
        </View>

        {/* Step 2 */}
        <View className="gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <View>
            <View className="mb-3 flex-row items-center gap-1.5">
              <Zap size={14} color="#000" />
              <Text className="font-mono text-xs font-bold uppercase tracking-[1.2px] text-black">
                2. Target Upgrade Phone
              </Text>
            </View>

            <FieldLabel>Choose Desired Device</FieldLabel>
            <Select
              title="Choose Desired Device"
              value={targetId}
              onChange={setTargetId}
              options={products.map((p) => ({ label: `${p.name} — ${formatNaira(p.price)}`, value: p.id }))}
            />

            <View className="mt-3">
              <FieldLabel>Your Name</FieldLabel>
              <TextInput
                placeholder="e.g. Ibrahim Kano"
                placeholderTextColor="#737373"
                value={customerName}
                onChangeText={setCustomerName}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-xs text-black"
              />
            </View>
          </View>

          {/* Live calculation */}
          <View className="gap-2 rounded-xl border border-neutral-300 bg-white p-4 shadow-sm">
            <Row label="Estimated Trade-in Value:" value={formatNaira(tradeValue)} />
            <Row label="Target Phone Price:" value={formatNaira(targetPrice)} />
            <View className="flex-row justify-between border-t border-neutral-200 pt-2">
              <Text className="text-xs font-bold text-black">Top-up Balance Required:</Text>
              <Text className="font-mono text-sm font-bold text-black">{formatNaira(topUp)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="mt-6 items-center gap-4 border-t border-neutral-200 pt-4">
        <View className="flex-row items-center gap-2">
          <ShieldCheck size={16} color="#000" />
          <Text className="text-[11px] text-neutral-600">Farm Centre Kano Store Verification Guarantee</Text>
        </View>

        <Pressable
          onPress={() =>
            openWhatsApp(whatsappPhone, buildSwapRequestText(input, customerName, tradeValue, target, topUp))
          }
          className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 shadow-xl active:bg-neutral-800"
        >
          <MessageSquare size={16} color="#fff" fill="#fff" />
          <Text className="text-xs font-bold text-white">Submit Swap Request on WhatsApp</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text className="mb-1 text-xs font-medium text-neutral-700">{children}</Text>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-xs text-neutral-600">{label}</Text>
      <Text className="font-mono text-xs font-semibold text-black">{value}</Text>
    </View>
  );
}
