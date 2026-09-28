import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co',
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

export const MEDIA_BUCKET = 'dr-apple-assets';

/** Uploads a local image (from expo-image-picker) to the dr-apple-assets bucket and returns its public URL. */
export async function uploadImageToStorage(localUri: string, mimeType = 'image/jpeg'): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured');

  const ext = mimeType.split('/')[1] || 'jpg';
  const filePath = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
  const body = await (await fetch(localUri)).arrayBuffer();

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, body, { contentType: mimeType, cacheControl: '3600', upsert: true });
  if (error) throw error;

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(filePath).data.publicUrl;
}
