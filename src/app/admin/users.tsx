import { AlertCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AdminShell, Panel, SavedBanner } from '@/components/admin/AdminShell';
import { Select } from '@/components/ui/Select';
import { Img } from '@/components/ui/primitives';
import { useCMS } from '@/lib/store';
import { Role } from '@/lib/types';

const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: 'Super Admin', value: 'Super Admin' },
  { label: 'Content Admin', value: 'Content Admin' },
  { label: 'User', value: 'User' },
];

const ROLE_PILL: Record<Role, { box: string; text: string }> = {
  'Super Admin': { box: 'bg-black border-black', text: 'text-white' },
  'Content Admin': { box: 'bg-neutral-200 border-neutral-300', text: 'text-black' },
  User: { box: 'bg-neutral-100 border-neutral-200', text: 'text-neutral-700' },
};

const COLS = [200, 190, 170, 160];

export default function AdminUsersScreen() {
  const { session, users, updateUserRole } = useCMS();
  const [savedMsg, setSavedMsg] = useState('');

  const handleRoleChange = (userId: string, role: Role) => {
    updateUserRole(userId, role);
    setSavedMsg(`User role updated to ${role}`);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <AdminShell title="Role-Based Access Control (RBAC)">
      <SavedBanner message={savedMsg} />

      {session?.role !== 'Super Admin' ? (
        <View className="flex-row items-center gap-3 rounded-2xl border border-black bg-neutral-100 p-6">
          <AlertCircle size={20} color="#000" />
          <Text className="flex-1 text-xs text-black">
            Access Restricted: Only Super Admin role can manage RBAC user permissions.
          </Text>
        </View>
      ) : (
        <Panel className="p-6">
          <View>
            <Text className="font-serif text-lg font-bold text-black">User Profiles & Role Matrix</Text>
            <Text className="text-xs text-neutral-500">
              Assign Super Admin, Content Admin, or Standard User permissions in Supabase Auth.
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View className="flex-row border-b border-neutral-200 bg-neutral-100">
                {['User', 'Email Address', 'Assigned Role (RBAC)', 'Action'].map((h, i) => (
                  <Text
                    key={h}
                    className="px-4 py-3.5 font-mono text-[10px] uppercase text-neutral-600"
                    style={{ width: COLS[i] }}
                  >
                    {h}
                  </Text>
                ))}
              </View>

              {users.map((usr) => (
                <View key={usr.id} className="flex-row items-center border-b border-neutral-200">
                  <View className="flex-row items-center gap-3 px-4 py-4" style={{ width: COLS[0] }}>
                    <Img
                      source={{
                        uri:
                          usr.avatar_url ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                      }}
                      className="h-8 w-8 rounded-full border border-neutral-300"
                      contentFit="cover"
                    />
                    <Text className="flex-1 text-xs font-semibold text-black" numberOfLines={1}>
                      {usr.name}
                    </Text>
                  </View>
                  <Text className="px-4 py-4 font-mono text-xs text-neutral-600" style={{ width: COLS[1] }} numberOfLines={1}>
                    {usr.email}
                  </Text>
                  <View className="px-4 py-4" style={{ width: COLS[2] }}>
                    <View className={`self-start rounded-full border px-3 py-1 ${ROLE_PILL[usr.role].box}`}>
                      <Text
                        className={`font-mono text-[10px] font-bold uppercase tracking-[0.5px] ${ROLE_PILL[usr.role].text}`}
                      >
                        {usr.role}
                      </Text>
                    </View>
                  </View>
                  <View className="px-4 py-4" style={{ width: COLS[3] }}>
                    <Select
                      variant="admin"
                      title={`Role for ${usr.name}`}
                      value={usr.role}
                      onChange={(role) => handleRoleChange(usr.id, role)}
                      options={ROLE_OPTIONS}
                    />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </Panel>
      )}
    </AdminShell>
  );
}
