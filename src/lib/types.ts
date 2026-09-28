export type ProductCategory = 'brand-new' | 'uk-used' | 'defect-deals' | 'accessories';

export type ProductBadgeType = 'badge-new' | 'badge-used' | 'badge-defect' | 'badge-accessory';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  badge_type: ProductBadgeType;
  badge_label: string;
  price: number;
  original_price?: number;
  currency: string;
  storage?: string; // e.g. '128GB', '256GB', '512GB', '1TB'
  color?: string;
  battery_health?: number; // e.g. 94%
  condition_description?: string;
  image_url: string;
  gallery?: string[];
  description: string;
  is_featured: boolean;
  is_published: boolean;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_bg_image: string;
  announcement_text: string;
  announcement_enabled: boolean;
  contact_phone: string;
  contact_whatsapp: string;
  store_address: string;
  store_city: string;
  updated_at?: string;
}

export interface SwapProgramContent {
  id?: string;
  title: string;
  subtitle: string;
  pinned_image_url: string;
  step1_title: string;
  step1_desc: string;
  step2_title: string;
  step2_desc: string;
  step3_title: string;
  step3_desc: string;
  valuation_guarantee_text: string;
  updated_at?: string;
}

export type Role = 'Super Admin' | 'Content Admin' | 'User';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  created_at?: string;
}

export interface AdminSession {
  email: string;
  role: Role;
  name: string;
}

export type PhysicalCondition = 'Pristine' | 'Good' | 'Minor Scratches' | 'Cracked Screen';

export type CategoryFilter = ProductCategory | 'all';
