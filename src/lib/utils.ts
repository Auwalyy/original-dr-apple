import { Linking } from 'react-native';

import { CategoryFilter, Product, ProductBadgeType } from './types';

export const DEFAULT_WHATSAPP = '2348031234567';

// Formatted by hand rather than Intl so output is identical on Hermes, JSC and web: ₦2,150,000
export function formatNaira(amount: number): string {
  const rounded = Math.round(amount);
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${rounded < 0 ? '-' : ''}₦${digits}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function formatBadgeLabel(badgeType: ProductBadgeType, customLabel?: string): string {
  if (customLabel) return customLabel;
  switch (badgeType) {
    case 'badge-new':
      return 'Brand New';
    case 'badge-used':
      return 'UK Used / Swap';
    case 'badge-defect':
      return 'Defect Deal';
    case 'badge-accessory':
      return 'Accessory';
    default:
      return 'Featured';
  }
}

export const CATEGORY_OPTIONS: { label: string; value: CategoryFilter }[] = [
  { label: 'All Catalogue', value: 'all' },
  { label: 'Brand New', value: 'brand-new' },
  { label: 'UK Used / Swap', value: 'uk-used' },
  { label: 'Defect Deals', value: 'defect-deals' },
  { label: 'Accessories', value: 'accessories' },
];

export function matchesSearch(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === '') return true;
  return (
    product.name.toLowerCase().includes(q) ||
    (product.storage?.toLowerCase().includes(q) ?? false) ||
    (product.color?.toLowerCase().includes(q) ?? false) ||
    product.description.toLowerCase().includes(q)
  );
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(phone: string, text: string): void {
  Linking.openURL(buildWhatsAppUrl(phone || DEFAULT_WHATSAPP, text)).catch((e) => {
    if (__DEV__) console.error(e);
  });
}

/**
 * DIRECT WHATSAPP CHECKOUT ROUTING (NO CARTS REQUIRED)
 * Same message payload as the website's buildWhatsAppBuyUrl.
 */
export function buildWhatsAppBuyText(product: Product, customNote?: string): string {
  let text =
    `Hello Dr Apple Kano, I am interested in buying the *${product.name}* for *${formatNaira(product.price)}*.\n\n` +
    `• Storage: ${product.storage || 'Standard'}\n` +
    `• Color: ${product.color || 'Standard'}\n` +
    `• Condition: ${product.badge_label}${product.battery_health ? ` (${product.battery_health}% BH)` : ''}\n` +
    `• Store Pickup / Delivery: Kano State\n`;

  if (customNote) {
    text += `\n*Note:* ${customNote}`;
  }

  text += `\nPlease confirm if this item is currently available in the Farm Centre, Kano store.`;
  return text;
}

export function triggerDirectWhatsAppBuy(product: Product, phone: string = DEFAULT_WHATSAPP): void {
  openWhatsApp(phone, buildWhatsAppBuyText(product));
}

export const INQUIRY_TEXT = "Hello Dr Apple Kano, I'd like to inquire about phone inventory at Farm Centre.";
