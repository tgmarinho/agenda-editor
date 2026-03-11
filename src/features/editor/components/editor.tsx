'use client';

import { useEffect, useRef } from 'react';
import { type AgendaTemplate } from '@/types/template';
import { useEditor } from '../hooks/use-editor';
import { useHistory } from '../hooks/use-history';
import { useFontLoader } from '../hooks/use-font-loader';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { StepIndicator } from './step-indicator';
import { Loader2 } from 'lucide-react';

interface EditorProps {
  template: AgendaTemplate;
}

export function Editor({ template }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { fontsLoaded } = useFontLoader();
  const {
    canvasRef,
    canvas,
    isLoading,
    hasSelection,
    addLogo,
    addText,
    deleteSelected,
    bringToFront,
    sendToBack,
    removeLogo,
    updateNameText,
    updateNameFont,
    updateNameColor,
    updateNameSize,
    nameFontWeight,
    nameFontStyle,
    updateNameFontWeight,
    updateNameFontStyle,
    exportHighRes,
    zoomLevel,
    zoomIn,
    zoomOut,
    zoomReset,
  } = useEditor(template);
  const { undo, redo, canUndo, canRedo, saveState } = useHistory(canvas);

  useEffect(() => {
    if (!canvas || !saveState) return;
    const handler = () => saveState();
    canvas.on('object:modified', handler);
    canvas.on('object:added', handler);
    canvas.on('object:removed', handler);
    return () => {
      canvas.off('object:modified', handler);
      canvas.off('object:added', handler);
      canvas.off('object:removed', handler);
    };
  }, [canvas, saveState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const target = e.target as Node;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      if (!canvas?.getActiveObject()) return;
      e.preventDefault();
      deleteSelected();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, deleteSelected]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <StepIndicator currentStep={1} />
      <Navbar
        onExport={exportHighRes}
        templateName={template.name}
        price={template.price}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        zoomLevel={zoomLevel}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onLogoUpload={addLogo}
          onRemoveLogo={removeLogo}
          onAddText={addText}
          onDeleteSelected={deleteSelected}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          hasSelection={hasSelection}
          onNameChange={updateNameText}
          onFontChange={updateNameFont}
          onColorChange={updateNameColor}
          onFontSizeChange={updateNameSize}
          nameFontWeight={nameFontWeight}
          nameFontStyle={nameFontStyle}
          onFontWeightChange={updateNameFontWeight}
          onFontStyleChange={updateNameFontStyle}
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
