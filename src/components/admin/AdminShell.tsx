import { Redirect, router, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Menu,
  Package,
  RefreshCw,
  Save,
  Shield,
  Sliders,
  Store,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { Role } from '@/lib/types';

type AdminPath = '/admin' | '/admin/products' | '/admin/settings' | '/admin/swap-program' | '/admin/media' | '/admin/users';

function navItems(role: Role): { label: string; path: AdminPath; icon: LucideIcon }[] {
  return [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products Catalogue', path: '/admin/products', icon: Package },
    { label: 'Hero Banner & Settings', path: '/admin/settings', icon: Sliders },
    { label: 'Swap Program Content', path: '/admin/swap-program', icon: RefreshCw },
    { label: 'Cloud Media Storage', path: '/admin/media', icon: ImageIcon },
    ...(role === 'Super Admin' ? [{ label: 'Users & RBAC Roles', path: '/admin/users' as const, icon: Users }] : []),
  ];
}

interface AdminShellProps {
  title: string;
  children: React.ReactNode;
  /** Set false when the child manages its own scrolling. */
  scroll?: boolean;
}

/** Mobile layout for the website's AdminSidebar + AdminHeader pair. */
export function AdminShell({ title, children, scroll = true }: AdminShellProps) {
  const { session } = useCMS();
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!session) return <Redirect href="/admin/login" />;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* AdminHeader */}
      <View className="border-b border-neutral-200 bg-white px-4 pb-4" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => setDrawerOpen(true)}
            className="rounded-lg border border-neutral-300 bg-neutral-100 p-2"
            accessibilityLabel="Open admin navigation"
          >
            <Menu size={20} color="#000" />
          </Pressable>
          <View className="flex-1">
            <Text className="font-serif text-xl font-bold text-black" numberOfLines={2}>
              {title}
            </Text>
            <Text className="text-xs text-neutral-600">Dr Apple Phones • Kano State CMS Control Center</Text>
          </View>
        </View>

        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <View className="flex-row items-center gap-3 rounded-xl border border-neutral-300 bg-neutral-100 px-3.5 py-1.5">
            <View className="h-7 w-7 items-center justify-center rounded-lg bg-black">
              <Shield size={16} color="#fff" />
            </View>
            <View>
              <Text className="text-xs font-bold text-black" numberOfLines={1}>
                {session.email}
              </Text>
              <Text className="-mt-0.5 font-mono text-[10px] text-neutral-600">{session.role}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1">
            <View className="h-2 w-2 rounded-full bg-black" />
            <Text className="font-mono text-[11px] text-black">CMS Live Sync Active</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20, paddingBottom: 32 + insets.bottom, gap: 24 }}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1">{children}</View>
        )}
      </KeyboardAvoidingView>

      <AdminSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { session, logout } = useCMS();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const role = session?.role ?? 'Super Admin';

  const go = (path: AdminPath | '/') => {
    onClose();
    if (path === '/') router.navigate('/');
    else if (path !== pathname) router.replace(path);
  };

  return (
    <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 flex-row">
        <Animated.View
          entering={SlideInLeft.duration(260)}
          style={{ width: 280, height: '100%', backgroundColor: '#fff', borderRightWidth: 1, borderColor: '#e5e5e5' }}
        >
          <View
            className="flex-1 justify-between p-5"
            style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
          >
            <View>
              {/* Brand header */}
              <View className="flex-row items-center gap-3 border-b border-neutral-200 pb-6">
                <BrandMark size={36} radius={12} />
                <View>
                  <Text className="font-serif text-base font-bold uppercase tracking-[1.2px] text-black">
                    DR APPLE CMS
                  </Text>
                  <Text className="-mt-0.5 font-mono text-[10px] text-neutral-600">{role} Portal</Text>
                </View>
              </View>

              {/* View storefront */}
              <Pressable
                onPress={() => go('/')}
                className="my-4 flex-row items-center justify-between rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2"
              >
                <View className="flex-row items-center gap-2">
                  <Store size={14} color="#000" />
                  <Text className="text-xs font-medium text-black">Live Kano Storefront</Text>
                </View>
                <ExternalLink size={12} color="#737373" />
              </Pressable>

              {/* Navigation */}
              <View className="mt-6 gap-1">
                {navItems(role).map((item) => {
                  const active = pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Pressable
                      key={item.path}
                      onPress={() => go(item.path)}
                      className={`flex-row items-center gap-3 rounded-xl px-3.5 py-2.5 ${active ? 'bg-black' : ''}`}
                      style={{
                        // Conditional shadows must use `style`, not className (see Navbar).
                        boxShadow: active ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <Icon size={16} color={active ? '#fff' : 'rgba(0,0,0,0.7)'} />
                      <Text className={`text-xs ${active ? 'font-bold text-white' : 'font-medium text-neutral-600'}`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* User info & logout */}
            <View className="gap-3 border-t border-neutral-200 pt-6">
              <View className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <Text className="text-xs font-semibold text-black">Kano Store Admin</Text>
                <Text className="font-mono text-[10px] text-neutral-600">Role: {role}</Text>
              </View>
              <Pressable
                onPress={() => {
                  onClose();
                  logout();
                  router.replace('/admin/login');
                }}
                className="flex-row items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-neutral-100 py-2.5 active:bg-black"
              >
                <LogOut size={16} color="#000" />
                <Text className="text-xs font-medium text-black">Exit Admin Portal</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <Pressable className="flex-1 bg-black/40" onPress={onClose} accessibilityLabel="Close navigation" />
      </View>
    </Modal>
  );
}

/** White bordered card used by every admin panel. */
export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <View className={`gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm ${className}`}>{children}</View>;
}

export function PublishButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 shadow-md active:bg-neutral-800"
    >
      <Save size={16} color="#fff" />
      <Text className="text-xs font-bold text-white">{label}</Text>
    </Pressable>
  );
}

export function SavedBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View className="flex-row items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-100 p-4">
      <Text className="text-black">✓</Text>
      <Text className="flex-1 font-mono text-xs font-semibold text-black">{message}</Text>
    </View>
  );
}
