'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TextSidebar } from './text-sidebar';
import { ImageSidebar } from './image-sidebar';
import { Type, Image, Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  onLogoUpload: (url: string) => void;
  onAddText: (text?: string) => void;
  onDeleteSelected: () => void;
  onNameChange: (name: string) => void;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onFontSizeChange: (size: number) => void;
}

export function Sidebar({
  onLogoUpload,
  onAddText,
  onDeleteSelected,
  onNameChange,
  onFontChange,
  onColorChange,
  onFontSizeChange,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-white border-r shadow-sm overflow-y-auto">
      <Tabs defaultValue="text">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="text" className="flex-1">
            <Type className="w-4 h-4 mr-1" />
            Texto
          </TabsTrigger>
          <TabsTrigger value="image" className="flex-1">
            <Image className="w-4 h-4 mr-1" />
            Logo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => onAddText()}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Texto
            </Button>
            <Button size="sm" variant="destructive" onClick={onDeleteSelected} title="Deletar selecionado">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Clique duplo em qualquer texto para editar. Selecione e pressione Delete ou use o botão acima para remover.
          </p>
          <TextSidebar
            onNameChange={onNameChange}
            onFontChange={onFontChange}
            onColorChange={onColorChange}
            onFontSizeChange={onFontSizeChange}
          />
        </TabsContent>
        <TabsContent value="image" className="p-4">
          <ImageSidebar onLogoUpload={onLogoUpload} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
