'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextSidebar } from './text-sidebar';
import { ImageSidebar } from './image-sidebar';
import { Type, Image } from 'lucide-react';

interface SidebarProps {
  onLogoUpload: (url: string) => void;
  onNameChange: (name: string) => void;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onFontSizeChange: (size: number) => void;
}

export function Sidebar({
  onLogoUpload,
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
        <TabsContent value="text" className="p-4">
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
