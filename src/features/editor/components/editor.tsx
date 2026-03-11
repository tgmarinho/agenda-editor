'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type AgendaTemplate } from '@/types/template';
import { useEditor } from '../hooks/use-editor';
import { useHistory } from '../hooks/use-history';
import { useFontLoader } from '../hooks/use-font-loader';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { StepIndicator } from './step-indicator';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { dataUrlToBlob } from '../utils';
import { uploadExportPng } from '@/lib/supabase/upload-export';
import { toast } from 'sonner';

interface EditorProps {
  template: AgendaTemplate;
}

export function Editor({ template }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { fontsLoaded } = useFontLoader();
  const saveDesign = trpc.design.save.useMutation();
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
    getExportDataUrl,
    getEditorState,
    zoomLevel,
    zoomIn,
    zoomOut,
    zoomReset,
  } = useEditor(template);
  const { undo, redo, canUndo, canRedo, saveState } = useHistory(canvas);

  const handleLogoUpload = useCallback(
    (url: string) => {
      setLogoUrl(url);
      addLogo(url);
    },
    [addLogo]
  );

  const handleRemoveLogo = useCallback(() => {
    setLogoUrl(null);
    removeLogo();
  }, [removeLogo]);

  const onSave = useCallback(async (): Promise<string | null> => {
    const dataUrl = getExportDataUrl();
    if (!dataUrl) {
      toast.error('Não foi possível gerar a imagem do design.');
      return null;
    }
    const blob = dataUrlToBlob(dataUrl);
    const filename = savedDesignId ? `design-${savedDesignId}.png` : `design-${Date.now()}.png`;
    let urlExport: string;
    try {
      urlExport = await uploadExportPng(blob, filename);
    } catch {
      toast.error('Falha no upload da imagem.');
      return null;
    }
    const editorState = getEditorState();
    if (!editorState) {
      toast.error('Estado do editor indisponível.');
      return null;
    }
    try {
      const res = await saveDesign.mutateAsync({
        templateId: template.id,
        editorState,
        userImageUrl: logoUrl ?? undefined,
        exportImageUrl: urlExport,
      });
      setSavedDesignId(res.id);
      toast.success('Design salvo');
      return res.id;
    } catch {
      toast.error('Falha ao salvar o design.');
      return null;
    }
  }, [getExportDataUrl, getEditorState, logoUrl, savedDesignId, saveDesign, template.id]);

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
        onSave={onSave}
        savedDesignId={savedDesignId}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onLogoUpload={handleLogoUpload}
          onRemoveLogo={handleRemoveLogo}
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
