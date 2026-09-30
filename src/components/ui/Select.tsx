import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { haptics } from '@/lib/haptics';

import { Img } from './primitives';
import { Sheet } from './Sheet';
import { colors } from './theme';

export interface SelectOption<T extends string> {
  label: string;
  value: T;
  description?: string;
  image?: string;
}

interface SelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  /** Field label, also used as the sheet title. */
  label?: string;
  placeholder?: string;
}

/** A form field that opens a bottom-sheet list — the native replacement for <select>. */
export function Select<T extends string>({ value, options, onChange, label, placeholder = 'Select' }: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <View className="gap-1.5">
      {!!label && <Text className="text-subhead font-medium text-secondary">{label}</Text>}
      <Pressable
        onPress={() => {
          haptics.selection();
          setOpen(true);
        }}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="h-12 flex-row items-center justify-between rounded-xl bg-fill px-4"
      >
        <Text className={`flex-1 text-body ${current ? 'text-ink' : 'text-tertiary'}`} numberOfLines={1}>
          {current?.label ?? placeholder}
        </Text>
        <ChevronDown size={18} color={colors.secondary} />
      </Pressable>

      <OptionSheet
        visible={open}
        title={label}
        value={value}
        options={options}
        onClose={() => setOpen(false)}
        onChange={onChange}
      />
    </View>
  );
}

export function OptionSheet<T extends string>({
  visible,
  title,
  value,
  options,
  onClose,
  onChange,
}: {
  visible: boolean;
  title?: string;
  value: T;
  options: SelectOption<T>[];
  onClose: () => void;
  onChange: (value: T) => void;
}) {
  return (
    <Sheet visible={visible} onClose={onClose} title={title}>
      <View className="gap-1">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                haptics.selection();
                onChange(opt.value);
                onClose();
              }}
              className={`min-h-[52px] flex-row items-center gap-3 rounded-xl px-3 py-2.5 active:bg-fill ${
                active ? 'bg-fill' : ''
              }`}
            >
              {!!opt.image && (
                <Img source={{ uri: opt.image }} className="h-11 w-11 rounded-lg bg-fill" contentFit="cover" />
              )}
              <View className="flex-1">
                <Text className={`text-body ${active ? 'font-semibold' : ''} text-ink`}>{opt.label}</Text>
                {!!opt.description && <Text className="mt-0.5 text-subhead text-secondary">{opt.description}</Text>}
              </View>
              {active && <Check size={20} color={colors.ink} strokeWidth={2.5} />}
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}
