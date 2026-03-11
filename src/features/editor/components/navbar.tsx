'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ShoppingCart, ArrowLeft, Undo2, Redo2 } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onExport: () => void;
  templateName: string;
  price: number;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Navbar({ onExport, templateName, price, onUndo, onRedo, canUndo, canRedo }: NavbarProps) {
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
        <Button size="sm" className="bg-primary text-white">
          <ShoppingCart className="w-4 h-4 mr-1" />
          Comprar {priceFormatted}
        </Button>
      </div>
    </nav>
  );
}
