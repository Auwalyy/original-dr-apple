import { Check, Lock } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { AdminScreen } from '@/components/admin/AdminScreen';
import { useFeedback } from '@/components/ui/Feedback';
import { EmptyState, Img } from '@/components/ui/primitives';
import { shadows } from '@/components/ui/theme';
import { useCMS } from '@/lib/store';
import { Role, UserProfile } from '@/lib/types';

const ROLES: { value: Role; description: string }[] = [
  { value: 'Super Admin', description: 'Full access, including team roles' },
  { value: 'Content Admin', description: 'Products, banners and swap content' },
  { value: 'User', description: 'No dashboard access' },
];

export default function AdminUsersScreen() {
  const { session, users, updateUserRole } = useCMS();
  const { toast, showActions } = useFeedback();

  if (session?.role !== 'Super Admin') {
    return (
      <AdminScreen>
        <EmptyState icon={Lock} title="Super Admins only" message="Ask a Super Admin to change team roles." />
      </AdminScreen>
    );
  }

  const changeRole = (user: UserProfile) =>
    showActions({
      title: user.name,
      message: 'Choose a role',
      options: ROLES.map((r) => ({
        label: r.value,
        icon: r.value === user.role ? Check : undefined,
        onPress: () => {
          if (r.value === user.role) return;
          updateUserRole(user.id, r.value);
          toast(`${user.name} is now ${r.value}`);
        },
      })),
    });

  return (
    <AdminScreen>
      <View className="gap-2">
        <View className="overflow-hidden rounded-2xl bg-white" style={shadows.card}>
          {users.map((user, i) => (
            <Pressable
              key={user.id}
              onPress={() => changeRole(user)}
              className={`flex-row items-center gap-3 bg-white px-4 py-3 active:bg-fill ${
                i > 0 ? 'border-t border-separator' : ''
              }`}
            >
              <Img source={{ uri: user.avatar_url }} className="h-11 w-11 rounded-full bg-fill" contentFit="cover" />
              <View className="flex-1">
                <Text className="text-body font-semibold text-ink">{user.name}</Text>
                <Text className="text-subhead text-secondary" numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
              <View className={`rounded-full px-2.5 py-1 ${user.role === 'Super Admin' ? 'bg-ink' : 'bg-fill'}`}>
                <Text
                  className={`text-caption font-semibold ${user.role === 'Super Admin' ? 'text-white' : 'text-ink'}`}
                >
                  {user.role}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Text className="px-4 text-caption text-secondary">Tap a person to change their role.</Text>
      </View>

      <View className="gap-3 rounded-2xl bg-white p-4" style={shadows.card}>
        {ROLES.map((r) => (
          <View key={r.value}>
            <Text className="text-body font-semibold text-ink">{r.value}</Text>
            <Text className="text-subhead text-secondary">{r.description}</Text>
          </View>
        ))}
      </View>
    </AdminScreen>
  );
}
