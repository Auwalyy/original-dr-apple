import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Sheet } from './Sheet';

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  title?: string;
  /** `rounded-lg bg-white` (storefront) or `rounded-xl bg-neutral-50` (admin). */
  variant?: 'store' | 'admin';
  className?: string;
}

/** Native replacement for the website's <select> elements. */
export function Select<T extends string>({
  value,
  options,
  onChange,
  title,
  variant = 'store',
  className = '',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className={`flex-row items-center justify-between border border-neutral-300 px-3 py-2.5 ${
          variant === 'store' ? 'rounded-lg bg-white' : 'rounded-xl bg-neutral-50'
        } ${className}`}
      >
        <Text className="flex-1 text-xs font-medium text-black" numberOfLines={1}>
          {current?.label ?? 'Select…'}
        </Text>
        <ChevronDown size={14} color="#525252" />
      </Pressable>

      <Sheet visible={open} onClose={() => setOpen(false)} maxHeight="70%">
        {title && (
          <Text className="mb-3 font-mono text-[11px] uppercase tracking-[1.5px] text-neutral-500">{title}</Text>
        )}
        <View className="gap-1">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex-row items-center justify-between rounded-xl px-3.5 py-3 ${
                  active ? 'bg-black' : 'bg-white'
                }`}
              >
                <Text className={`flex-1 text-xs ${active ? 'font-bold text-white' : 'font-medium text-neutral-700'}`}>
                  {opt.label}
                </Text>
                {active && <Check size={14} color="#fff" />}
              </Pressable>
            );
          })}
        </View>
      </Sheet>
    </>
  );
}
