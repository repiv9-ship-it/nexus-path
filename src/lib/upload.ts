import { supabase } from '@/integrations/supabase/client';

export async function uploadFile(file: File, folder: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const ext = file.name.split('.').pop() || 'bin';
  const path = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: false });
  if (error) {
    console.error('upload error', error);
    return null;
  }
  const { data } = supabase.storage.from('uploads').getPublicUrl(path);
  return data.publicUrl;
}
