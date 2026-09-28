import { PhysicalCondition, Product } from './types';
import { formatNaira } from './utils';

// Trade-in pricing rules, identical to the website's SwapCalculatorModal.
export const BASE_VALUATIONS: Record<string, number> = {
  'iPhone 11': 220000,
  'iPhone 11 Pro Max': 310000,
  'iPhone 12': 320000,
  'iPhone 12 Pro Max': 480000,
  'iPhone 13': 460000,
  'iPhone 13 Pro Max': 680000,
  'iPhone 14': 590000,
  'iPhone 14 Pro Max': 880000,
  'iPhone 15': 780000,
  'iPhone 15 Pro Max': 1150000,
};

export const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];

export const CONDITION_OPTIONS: { value: PhysicalCondition; label: string }[] = [
  { value: 'Pristine', label: 'Pristine (0 scratches, like brand new)' },
  { value: 'Good', label: 'Good (Normal minor wear, screen clean)' },
  { value: 'Minor Scratches', label: 'Minor Scratches (Noticeable scuffs)' },
  { value: 'Cracked Screen', label: 'Cracked Screen / Defect' },
];

export interface SwapInput {
  model: string;
  storage: string;
  batteryHealth: number;
  condition: PhysicalCondition;
}

export function estimateTradeInValue({ model, storage, batteryHealth, condition }: SwapInput): number {
  const baseVal = BASE_VALUATIONS[model] || 350000;

  let storageMult = 1.0;
  if (storage === '256GB') storageMult = 1.12;
  if (storage === '512GB') storageMult = 1.25;
  if (storage === '1TB') storageMult = 1.4;

  let bhMult = 1.0;
  if (batteryHealth < 80) bhMult = 0.85;
  else if (batteryHealth < 85) bhMult = 0.92;
  else if (batteryHealth >= 95) bhMult = 1.05;

  let condMult = 1.0;
  if (condition === 'Pristine') condMult = 1.1;
  if (condition === 'Minor Scratches') condMult = 0.9;
  if (condition === 'Cracked Screen') condMult = 0.65;

  return Math.round(baseVal * storageMult * bhMult * condMult);
}

export function buildSwapRequestText(
  input: SwapInput,
  customerName: string,
  tradeValue: number,
  target: Product | undefined,
  topUp: number
): string {
  return (
    `*DR APPLE KANO - SWAP & UPGRADE REQUEST* \n\n` +
    `*Customer Name:* ${customerName || 'Kano Customer'}\n\n` +
    `*CURRENT DEVICE:* ${input.model} (${input.storage})\n` +
    `*Battery Health:* ${input.batteryHealth}%\n` +
    `*Physical Condition:* ${input.condition}\n` +
    `*Estimated Trade-in Valuation:* ${formatNaira(tradeValue)}\n\n` +
    `*TARGET UPGRADE DEVICE:* ${target?.name || 'Selected Device'}\n` +
    `*Target Price:* ${formatNaira(target?.price ?? 0)}\n` +
    `*ESTIMATED TOP-UP BALANCE:* *${formatNaira(topUp)}*\n\n` +
    `I would like to book a physical inspection at Farm Centre Kano to complete this swap. Please confirm!`
  );
}
