import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Remplacez ces valeurs par vos vraies clés Supabase
const supabaseUrl = 'https://vfztcqpiehtdiycnwgsq.supabase.co';
const supabaseAnonKey = 'sb_publishable_AAeM8hZe2mcFX1XaDJ59QQ_iu4qAQ_f';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function pour uploader une photo
export async function uploadPhoto(file, profileId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${profileId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  // Récupérer l'URL publique
  const { data: urlData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
