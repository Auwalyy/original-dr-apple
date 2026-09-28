import { BadgePercent, Headphones, LucideIcon, Smartphone, Sparkles } from 'lucide-react-native';

import { CategoryFilter, Product, ProductCategory } from './types';

export interface CategoryMeta {
  value: ProductCategory;
  label: string;
  description: string;
  icon: LucideIcon;
}

// Descriptions follow the category seed rows in the website's supabase/schema.sql.
export const CATEGORIES: CategoryMeta[] = [
  { value: 'brand-new', label: 'Brand New', description: 'Factory sealed, 1-year warranty', icon: Sparkles },
  { value: 'uk-used', label: 'UK Used', description: 'Grade A, 50-point tested', icon: Smartphone },
  { value: 'defect-deals', label: 'Defect Deals', description: 'Minor faults, big savings', icon: BadgePercent },
  { value: 'accessories', label: 'Accessories', description: 'Chargers, AirPods & more', icon: Headphones },
];

export const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
];

export function categoryLabel(category: ProductCategory): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function discountPercent(product: Product): number {
  if (!product.original_price || product.original_price <= product.price) return 0;
  return Math.round((1 - product.price / product.original_price) * 100);
}

export type StockTone = 'success' | 'warning' | 'danger';

export function stockStatus(product: Product): { label: string; tone: StockTone } {
  if (product.stock <= 0) return { label: 'Sold out', tone: 'danger' };
  if (product.stock <= 3) return { label: `Only ${product.stock} left`, tone: 'warning' };
  return { label: 'In stock', tone: 'success' };
}

/** "256GB · Desert Titanium · 96% battery" — only the parts a product actually has. */
export function productMeta(product: Product, { battery = true } = {}): string {
  return [
    product.storage,
    product.color,
    battery && product.battery_health && product.category !== 'brand-new' ? `${product.battery_health}% battery` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
];

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'newest':
      return list.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
    default:
      return list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  }
}
