import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AdminScreen } from '@/components/admin/AdminScreen';
import { BrandSwitch, FormSection, ToggleRow } from '@/components/admin/FormSection';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useFeedback } from '@/components/ui/Feedback';
import { Select } from '@/components/ui/Select';
import { Button, HeaderButton, TextField } from '@/components/ui/primitives';
import { colors } from '@/components/ui/theme';
import { CATEGORIES } from '@/lib/catalog';
import { haptics } from '@/lib/haptics';
import { useCMS } from '@/lib/store';
import { Product, ProductBadgeType, ProductCategory } from '@/lib/types';
import { formatNaira, slugify } from '@/lib/utils';

const CATEGORY_DEFAULTS: Record<ProductCategory, { badge: ProductBadgeType; label: string; battery: string }> = {
  'brand-new': { badge: 'badge-new', label: 'Brand New', battery: '100' },
  'uk-used': { badge: 'badge-used', label: 'UK Used / Swap', battery: '90' },
  'defect-deals': { badge: 'badge-defect', label: 'Defect Deal', battery: '85' },
  accessories: { badge: 'badge-accessory', label: 'Accessory', battery: '' },
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000';

interface FormState {
  name: string;
  category: ProductCategory;
  price: string;
  originalPrice: string;
  storage: string;
  color: string;
  battery: string;
  condition: string;
  description: string;
  image: string;
  stock: number;
  published: boolean;
  featured: boolean;
}

function toForm(p?: Product): FormState {
  return {
    name: p?.name ?? '',
    category: p?.category ?? 'brand-new',
    price: p ? String(p.price) : '',
    originalPrice: p?.original_price ? String(p.original_price) : '',
    storage: p?.storage ?? '',
    color: p?.color ?? '',
    battery: p ? (p.battery_health?.toString() ?? '') : '100',
    condition: p?.condition_description ?? '',
    description: p?.description ?? '',
    image: p?.image_url ?? DEFAULT_IMAGE,
    stock: p?.stock ?? 1,
    published: p?.is_published ?? true,
    featured: p?.is_featured ?? false,
  };
}

const digits = (t: string) => t.replace(/[^0-9]/g, '');
/** 2150000 → "2,150,000" for display while typing; the form keeps plain digits. */
const grouped = (d: string) => d.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default function ProductEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, addProduct, updateProduct, deleteProduct } = useCMS();
  const { toast, showActions } = useFeedback();

  const existing = products.find((p) => p.id === id);
  const isNew = id === 'new' || !existing;
  const [initial] = useState(() => toForm(existing));
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const changeCategory = (category: ProductCategory) =>
    setForm((f) => ({
      ...f,
      category,
      // Pre-fill a sensible battery value for new listings; never overwrite what the user typed.
      battery: isNew && !f.battery ? CATEGORY_DEFAULTS[category].battery : category === 'accessories' ? '' : f.battery,
    }));

  const save = () => {
    const price = Number(digits(form.price));
    const nextErrors = {
      name: form.name.trim() ? undefined : 'Give the product a name',
      price: price > 0 ? undefined : 'Enter a price',
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.price) {
      haptics.warning();
      return;
    }

    const defaults = CATEGORY_DEFAULTS[form.category];
    const original = Number(digits(form.originalPrice));
    const battery = Number(digits(form.battery));
    const data = {
      name: form.name.trim(),
      slug: slugify(form.name.trim()),
      category: form.category,
      badge_type: defaults.badge,
      badge_label: existing && existing.category === form.category ? existing.badge_label : defaults.label,
      price,
      original_price: original > price ? original : undefined,
      currency: 'NGN',
      storage: form.storage.trim() || undefined,
      color: form.color.trim() || undefined,
      battery_health: battery > 0 ? Math.min(battery, 100) : undefined,
      condition_description: form.condition.trim() || undefined,
      image_url: form.image || DEFAULT_IMAGE,
      gallery: existing?.gallery,
      description: form.description.trim() || 'Certified Apple device from Dr Apple Kano.',
      is_featured: form.featured,
      is_published: form.published,
      stock: form.stock,
    };

    if (isNew) addProduct(data);
    else updateProduct(existing.id, data);
    toast(isNew ? 'Product added' : 'Changes saved');
    router.back();
  };

  const cancel = () => {
    if (!dirty) return router.back();
    showActions({
      title: 'Discard changes?',
      message: 'Your edits to this product will be lost.',
      options: [{ label: 'Discard changes', destructive: true, onPress: () => router.back() }],
    });
  };

  const remove = () =>
    showActions({
      title: `Delete “${existing?.name}”?`,
      message: 'It will be removed from the storefront immediately. This can’t be undone.',
      options: [
        {
          label: 'Delete product',
          icon: Trash2,
          destructive: true,
          onPress: () => {
            if (existing) deleteProduct(existing.id);
            toast('Product deleted');
            router.back();
          },
        },
      ],
    });

  const priceNum = Number(digits(form.price));
  const originalNum = Number(digits(form.originalPrice));

  return (
    <>
      <Stack.Screen
        options={{
          title: isNew ? 'New product' : 'Edit product',
          headerBackVisible: false,
          gestureEnabled: !dirty,
          headerLeft: () => <HeaderButton title="Cancel" bold={false} onPress={cancel} />,
          headerRight: () => <HeaderButton title="Save" onPress={save} disabled={!isNew && !dirty} />,
        }}
      />
      <AdminScreen>
        <FormSection title="Photo">
          <ImageUploader value={form.image} onChange={(url) => set('image', url)} />
        </FormSection>

        <FormSection title="Details">
          <TextField
            label="Name"
            placeholder="iPhone 16 Pro Max 256GB"
            value={form.name}
            onChangeText={(t) => {
              set('name', t);
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
            }}
            error={errors.name}
          />
          <Select
            label="Category"
            value={form.category}
            onChange={changeCategory}
            options={CATEGORIES.map((c) => ({ value: c.value, label: c.label, description: c.description }))}
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextField
                label="Storage"
                placeholder="256GB"
                value={form.storage}
                onChangeText={(t) => set('storage', t)}
              />
            </View>
            <View className="flex-1">
              <TextField
                label="Colour"
                placeholder="Natural Titanium"
                value={form.color}
                onChangeText={(t) => set('color', t)}
              />
            </View>
          </View>
          {form.category !== 'accessories' && (
            <TextField
              label="Battery health (%)"
              placeholder="96"
              keyboardType="number-pad"
              maxLength={3}
              value={form.battery}
              onChangeText={(t) => set('battery', digits(t))}
            />
          )}
        </FormSection>

        <FormSection
          title="Pricing"
          footer={
            originalNum > priceNum && priceNum > 0
              ? `Shown as ${formatNaira(originalNum - priceNum)} off (${Math.round((1 - priceNum / originalNum) * 100)}%).`
              : 'Add a higher “was” price to show a discount.'
          }
        >
          <View className="flex-row gap-3">
            <View className="flex-1">
              <TextField
                label="Price (₦)"
                placeholder="1,050,000"
                keyboardType="number-pad"
                value={grouped(form.price)}
                onChangeText={(t) => {
                  set('price', digits(t));
                  if (errors.price) setErrors((e) => ({ ...e, price: undefined }));
                }}
                error={errors.price}
              />
            </View>
            <View className="flex-1">
              <TextField
                label="Was (₦)"
                placeholder="Optional"
                keyboardType="number-pad"
                value={grouped(form.originalPrice)}
                onChangeText={(t) => set('originalPrice', digits(t))}
              />
            </View>
          </View>
        </FormSection>

        <FormSection title="Description">
          <TextField
            label="Condition report"
            placeholder="e.g. 96% battery, factory unlocked, no scratches"
            value={form.condition}
            onChangeText={(t) => set('condition', t)}
          />
          <TextField
            label="About this item"
            placeholder="Features, warranty and what’s in the box"
            multiline
            value={form.description}
            onChangeText={(t) => set('description', t)}
          />
        </FormSection>

        <FormSection title="Availability">
          <ToggleRow
            title="Stock"
            description={form.stock === 0 ? 'Shown as sold out' : `${form.stock} available`}
            control={<Stepper value={form.stock} onChange={(n) => set('stock', n)} />}
          />
          <View className="h-px bg-separator" />
          <ToggleRow
            title="Show in store"
            description="Hidden products stay in the dashboard only"
            control={<BrandSwitch value={form.published} onChange={(v) => set('published', v)} />}
          />
          <View className="h-px bg-separator" />
          <ToggleRow
            title="Featured"
            description="Appears in the Featured row on Home"
            control={<BrandSwitch value={form.featured} onChange={(v) => set('featured', v)} />}
          />
        </FormSection>

        {!isNew && <Button title="Delete product" variant="danger" icon={Trash2} onPress={remove} />}
      </AdminScreen>
    </>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const step = (delta: number) => {
    haptics.selection();
    onChange(Math.max(0, value + delta));
  };
  return (
    <View className="h-9 flex-row items-center rounded-full bg-fill">
      <Pressable
        onPress={() => step(-1)}
        hitSlop={6}
        className="h-9 w-10 items-center justify-center"
        accessibilityLabel="Decrease stock"
      >
        <Minus size={16} color={value === 0 ? colors.tertiary : colors.ink} />
      </Pressable>
      <Text className="min-w-[28px] text-center text-body font-semibold text-ink">{value}</Text>
      <Pressable
        onPress={() => step(1)}
        hitSlop={6}
        className="h-9 w-10 items-center justify-center"
        accessibilityLabel="Increase stock"
      >
        <Plus size={16} color={colors.ink} />
      </Pressable>
    </View>
  );
}
