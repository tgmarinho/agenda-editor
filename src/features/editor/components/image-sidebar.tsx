'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { uploadLogo } from '@/lib/supabase/upload-logo';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface ImageSidebarProps {
  onLogoUpload: (url: string) => void;
}

export function ImageSidebar({ onLogoUpload }: ImageSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE_BYTES) {
      toast.error('Use PNG, JPG ou SVG. Máximo 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadLogo(file);
      setPreview(url);
      onLogoUpload(url);
    } catch {
      toast.error('Falha no upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Logo ou Imagem</h3>
        <p className="text-xs text-gray-500 mb-3">
          Faça upload da logo da sua empresa ou uma imagem pessoal. Você poderá arrastar e redimensionar no canvas.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {preview ? (
        <div className="space-y-2">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Logo preview"
              className="w-full rounded border border-gray-200"
            />
            <button
              onClick={handleRemove}
              disabled={isUploading}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando…
              </>
            ) : (
              'Trocar imagem'
            )}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-600">Enviando…</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Clique para fazer upload</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG ou SVG. Máximo 5MB.</p>
            </>
          )}
        </button>
      )}
    </div>
  );
}
