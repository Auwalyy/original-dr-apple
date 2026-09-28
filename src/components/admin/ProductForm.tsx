import { ArrowLeft, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Select } from '@/components/ui/Select';
import { Checkbox, Input, Label } from '@/components/ui/primitives';
import { NewProduct } from '@/lib/store';
import { Product, ProductBadgeType, ProductCategory } from '@/lib/types';
import { slugify } from '@/lib/utils';

import { ImageUploader } from './ImageUploader';

interface ProductFormProps {
  initialProduct?: Product | null;
  onSubmit: (data: NewProduct) => void;
  onCancel: () => void;
  title?: string;
}

const CATEGORY_DEFAULTS: Record<ProductCategory, { badge: ProductBadgeType; label: string; bh?: number }> = {
  'brand-new': { badge: 'badge-new', label: 'Brand New', bh: 100 },
  'uk-used': { badge: 'badge-used', label: 'UK Used / Swap', bh: 90 },
  'defect-deals': { badge: 'badge-defect', label: 'Defect Deal', bh: 85 },
  accessories: { badge: 'badge-accessory', label: 'Accessory', bh: undefined },
};

const numOrUndefined = (t: string) => (t.trim() === '' ? undefined : Number(t.replace(/[^0-9]/g, '')));

export function ProductForm({ initialProduct, onSubmit, onCancel, title = 'Create New Phone Product' }: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name || '');
  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category || 'brand-new');
  const [badgeType, setBadgeType] = useState<ProductBadgeType>(initialProduct?.badge_type || 'badge-new');
  const [badgeLabel, setBadgeLabel] = useState(initialProduct?.badge_label || 'Brand New');
  const [price, setPrice] = useState(String(initialProduct?.price ?? 500000));
  const [originalPrice, setOriginalPrice] = useState(initialProduct?.original_price?.toString() ?? '');
  const [storage, setStorage] = useState(initialProduct?.storage || '256GB');
  const [color, setColor] = useState(initialProduct?.color || 'Natural Titanium');
  const [batteryHealth, setBatteryHealth] = useState(
    initialProduct ? (initialProduct.battery_health?.toString() ?? '') : '100'
  );
  const [conditionDesc, setConditionDesc] = useState(initialProduct?.condition_description || '');
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.image_url ||
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000'
  );
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [isFeatured, setIsFeatured] = useState(initialProduct?.is_featured ?? true);
  const [isPublished, setIsPublished] = useState(initialProduct?.is_published ?? true);
  const [stock, setStock] = useState(String(initialProduct?.stock ?? 5));

  const handleCategoryChange = (cat: ProductCategory) => {
    const d = CATEGORY_DEFAULTS[cat];
    setCategory(cat);
    setBadgeType(d.badge);
    setBadgeLabel(d.label);
    setBatteryHealth(d.bh?.toString() ?? '');
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      slug: slugify(name.trim()),
      category,
      badge_type: badgeType,
      badge_label: badgeLabel || 'Brand New',
      price: numOrUndefined(price) ?? 0,
      original_price: numOrUndefined(originalPrice) || undefined,
      currency: 'NGN',
      storage,
      color,
      battery_health: numOrUndefined(batteryHealth) || undefined,
      condition_description: conditionDesc,
      image_url: imageUrl,
      gallery: initialProduct?.gallery,
      description: description || 'Certified Apple device from Dr Apple Kano.',
      is_featured: isFeatured,
      is_published: isPublished,
      stock: numOrUndefined(stock) ?? 0,
    });
  };

  return (
    <View className="gap-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl">
      {/* Header */}
      <View className="gap-4 border-b border-neutral-200 pb-4">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={onCancel} className="rounded-lg p-2">
            <ArrowLeft size={20} color="#737373" />
          </Pressable>
          <View className="flex-1">
            <Text className="font-serif text-xl font-bold text-black">{title}</Text>
            <Text className="text-xs text-neutral-600">
              Configure product specifications, badges, pricing & media assets
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-end gap-2">
          <Pressable onPress={onCancel} className="px-4 py-2">
            <Text className="text-xs font-semibold text-neutral-600">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            disabled={!name.trim()}
            className={`flex-row items-center gap-2 rounded-xl bg-black px-6 py-2.5 shadow-lg ${name.trim() ? '' : 'opacity-50'}`}
          >
            <Save size={16} color="#fff" />
            <Text className="text-xs font-bold text-white">Save Product</Text>
          </Pressable>
        </View>
      </View>

      <View className="gap-4">
        <View>
          <Label>Product Name / Title</Label>
          <Input placeholder="e.g. iPhone 16 Pro Max 256GB" value={name} onChangeText={setName} className="font-medium" />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Label>Category</Label>
            <Select
              variant="admin"
              title="Category"
              value={category}
              onChange={handleCategoryChange}
              options={[
                { label: 'Brand New', value: 'brand-new' },
                { label: 'UK Used / Swap', value: 'uk-used' },
                { label: 'Defect Deals', value: 'defect-deals' },
                { label: 'Accessories', value: 'accessories' },
              ]}
            />
          </View>
          <View className="flex-1">
            <Label>Badge Styling</Label>
            <Select
              variant="admin"
              title="Badge Styling (Required CSS)"
              value={badgeType}
              onChange={setBadgeType}
              options={[
                { label: '.badge-new (Black/White)', value: 'badge-new' },
                { label: '.badge-used (Clean White)', value: 'badge-used' },
                { label: '.badge-defect (Defect Deal)', value: 'badge-defect' },
                { label: '.badge-accessory (Accessory)', value: 'badge-accessory' },
              ]}
            />
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Label>Price (NGN ₦)</Label>
            <Input keyboardType="number-pad" value={price} onChangeText={setPrice} className="font-mono" />
          </View>
          <View className="flex-1">
            <Label>Original Price</Label>
            <Input
              keyboardType="number-pad"
              placeholder="Optional higher price"
              value={originalPrice}
              onChangeText={setOriginalPrice}
              className="font-mono"
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Label>Storage</Label>
            <Input placeholder="256GB" value={storage} onChangeText={setStorage} />
          </View>
          <View className="flex-1">
            <Label>Color</Label>
            <Input placeholder="Desert Titanium" value={color} onChangeText={setColor} />
          </View>
          <View className="flex-1">
            <Label>Battery %</Label>
            <Input
              keyboardType="number-pad"
              maxLength={3}
              placeholder="96"
              value={batteryHealth}
              onChangeText={setBatteryHealth}
              className="font-mono"
            />
          </View>
        </View>

        <View>
          <Label>Condition Description</Label>
          <Input
            placeholder="e.g. Pristine UK Used, 0 Scratches, 96% BH, Factory Unlocked"
            value={conditionDesc}
            onChangeText={setConditionDesc}
          />
        </View>

        <ImageUploader value={imageUrl} onChange={setImageUrl} label="Product Image (Supabase Storage)" />

        <View>
          <Label>Full Description</Label>
          <Input
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Detailed description of features, warranty, and condition..."
            value={description}
            onChangeText={setDescription}
            className="min-h-[96px]"
          />
        </View>

        <View className="flex-row gap-4 pt-2">
          <View className="flex-1">
            <Label>Stock Quantity</Label>
            <Input keyboardType="number-pad" value={stock} onChangeText={setStock} className="font-mono" />
          </View>
          <View className="flex-1 justify-end gap-3 pb-1">
            <Checkbox checked={isPublished} onChange={setIsPublished} label="Published on Storefront" />
            <Checkbox checked={isFeatured} onChange={setIsFeatured} label="Featured on Homepage" />
          </View>
        </View>
      </View>
    </View>
  );
}
