import { createClient } from '@/lib/supabase/client';

const BUCKET = 'exports';

/**
 * Garante que o path termine em .png (evita duplicar extensão).
 */
function toExportPath(filename: string): string {
  const base = filename.replace(/\.png$/i, '');
  return `exports/${base}.png`;
}

/**
 * Faz upload do PNG exportado (capa em alta resolução) para o Supabase Storage
 * (bucket 'exports') e retorna a URL pública.
 *
 * O caller (Editor) pode obter o Blob a partir do canvas com:
 * dataUrlToBlob(canvas.toDataURL('image/png')) de @/features/editor/utils.
 *
 * Pré-requisito: bucket 'exports' deve existir no Supabase com policy
 * que permita insert e leitura pública (getPublicUrl).
 */
export async function uploadExportPng(
  blob: Blob,
  filename: string
): Promise<string> {
  const supabase = createClient();
  const path = toExportPath(filename);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
