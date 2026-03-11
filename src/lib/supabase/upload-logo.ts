import { createClient } from '@/lib/supabase/client';

const BUCKET = 'logos';

/**
 * Gera um path único para o arquivo no bucket (evita colisões).
 */
function uniquePath(file: File): string {
  const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
  return `${Date.now()}-${safeName}`;
}

/**
 * Faz upload do logo para o Supabase Storage (bucket 'logos'),
 * retorna a URL pública. Rejeita em caso de erro.
 *
 * Pré-requisito: bucket 'logos' deve existir no Supabase com policy
 * que permita insert (e leitura pública se usar getPublicUrl).
 */
export async function uploadLogo(file: File): Promise<string> {
  const supabase = createClient();
  const path = uniquePath(file);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
