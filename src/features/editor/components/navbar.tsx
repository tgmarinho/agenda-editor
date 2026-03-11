'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ShoppingCart, ArrowLeft, Undo2, Redo2, Minus, Plus, Save } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onExport: () => void;
  templateName: string;
  price: number;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onSave?: () => Promise<string | null>;
  savedDesignId?: string | null;
}

export function Navbar({
  onExport,
  templateName,
  price,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onSave,
  savedDesignId = null,
}: NavbarProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        onUndo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        onRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo]);

  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price / 100);

  return (
    <nav className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/templates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Templates
          </Button>
        </Link>
        <span className="text-sm font-medium text-gray-700">{templateName}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 border rounded-md px-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomOut} title="Diminuir zoom">
            <Minus className="w-4 h-4" />
          </Button>
          <button
            type="button"
            onClick={onZoomReset}
            className="min-w-14 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5"
            title="Redefinir para 100%"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomIn} title="Aumentar zoom">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo} title="Desfazer (Ctrl+Z)">
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo} title="Refazer (Ctrl+Y)">
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-1" />
          Exportar PNG
        </Button>
        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>Salvando…</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                Salvar Design
              </>
            )}
          </Button>
        )}
        <Button size="sm" className="bg-primary text-white">
          <ShoppingCart className="w-4 h-4 mr-1" />
          Comprar {priceFormatted}
        </Button>
      </div>
    </nav>
  );
}
