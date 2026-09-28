import { router } from 'expo-router';
import {
  CheckCircle2,
  Image as ImageIcon,
  LogOut,
  LucideIcon,
  Package,
  RefreshCw,
  SlidersHorizontal,
  Store,
  Users,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

import { AdminScreen } from '@/components/admin/AdminScreen';
import { useFeedback } from '@/components/ui/Feedback';
import { ListRow, ListSection } from '@/components/ui/primitives';
import { colors, shadows } from '@/components/ui/theme';
import { useCMS } from '@/lib/store';

export default function AdminDashboardScreen() {
  const { products, media, users, session, logout } = useCMS();
  const { showActions } = useFeedback();
  const isSuper = session?.role === 'Super Admin';

  const stats: { icon: LucideIcon; label: string; value: number }[] = [
    { icon: Package, label: 'Products', value: products.length },
    { icon: CheckCircle2, label: 'Live in store', value: products.filter((p) => p.is_published).length },
    { icon: RefreshCw, label: 'UK used', value: products.filter((p) => p.category === 'uk-used').length },
    { icon: Zap, label: 'Defect deals', value: products.filter((p) => p.category === 'defect-deals').length },
  ];

  const signOut = () =>
    showActions({
      title: 'Sign out of the dashboard?',
      options: [
        {
          label: 'Sign out',
          icon: LogOut,
          destructive: true,
          onPress: () => {
            logout();
            router.dismissTo('/store');
          },
        },
      ],
    });

  return (
    <AdminScreen>
      <View>
        <Text className="text-body text-secondary">Welcome back,</Text>
        <View className="mt-0.5 flex-row items-center gap-2">
          <Text className="text-title font-bold text-ink">{session?.name}</Text>
          <View className="rounded-full bg-ink px-2.5 py-1">
            <Text className="text-caption font-semibold text-white">{session?.role}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <View key={label} className="rounded-2xl bg-white p-4" style={[{ width: '48.3%' }, shadows.card]}>
            <Icon size={20} color={colors.ink} />
            <Text className="mt-3 text-title font-bold text-ink">{value}</Text>
            <Text className="text-subhead text-secondary">{label}</Text>
          </View>
        ))}
      </View>

      <ListSection title="Manage" inset={60}>
        <ListRow
          icon={Package}
          title="Products"
          subtitle="Prices, stock, photos and visibility"
          value={String(products.length)}
          onPress={() => router.push('/admin/products')}
        />
        <ListRow
          icon={SlidersHorizontal}
          title="Storefront"
          subtitle="Home banner, announcement and contact details"
          onPress={() => router.push('/admin/settings')}
        />
        <ListRow
          icon={RefreshCw}
          title="Swap content"
          subtitle="How-it-works steps and guarantee"
          onPress={() => router.push('/admin/swap-program')}
        />
        <ListRow
          icon={ImageIcon}
          title="Media library"
          value={String(media.length)}
          onPress={() => router.push('/admin/media')}
        />
        {isSuper && (
          <ListRow
            icon={Users}
            title="Team & roles"
            value={String(users.length)}
            onPress={() => router.push('/admin/users')}
          />
        )}
      </ListSection>

      <ListSection inset={60}>
        <ListRow icon={Store} title="View storefront" onPress={() => router.dismissTo('/')} />
        <ListRow icon={LogOut} title="Sign out" destructive chevron={false} onPress={signOut} />
      </ListSection>
    </AdminScreen>
  );
}
