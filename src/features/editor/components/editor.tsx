'use client';

import { useRef } from 'react';
import { type AgendaTemplate } from '@/types/template';
import { useEditor } from '../hooks/use-editor';
import { useFontLoader } from '../hooks/use-font-loader';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Loader2 } from 'lucide-react';

interface EditorProps {
  template: AgendaTemplate;
}

export function Editor({ template }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { fontsLoaded } = useFontLoader();
  const {
    canvasRef,
    isLoading,
    addLogo,
    addText,
    deleteSelected,
    updateNameText,
    updateNameFont,
    updateNameColor,
    updateNameSize,
    exportHighRes,
  } = useEditor(template);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar
        onExport={exportHighRes}
        templateName={template.name}
        price={template.price}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onLogoUpload={addLogo}
          onAddText={addText}
          onDeleteSelected={deleteSelected}
          onNameChange={updateNameText}
          onFontChange={updateNameFont}
          onColorChange={updateNameColor}
          onFontSizeChange={updateNameSize}
        />
        <main
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-8 overflow-hidden"
        >
          <div className="relative shadow-2xl">
            {(isLoading || !fontsLoaded) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="rounded"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
