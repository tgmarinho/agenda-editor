import { useCallback, useEffect, useRef, useState } from 'react';
import { type AgendaTemplate } from '@/types/template';
import { generateExportOptions, downloadFile } from '../utils';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../types';

const CURRENT_YEAR = new Date().getFullYear().toString();

export function useEditor(template: AgendaTemplate | null) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [canvas, setCanvas] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nameObject, setNameObject] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logoObject, setLogoObject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initCanvas = useCallback(async () => {
    if (!canvasRef.current || !template) return;

    const { fabric } = await import('fabric');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabricCanvas = new (fabric as any).Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      preserveObjectStacking: true,
    });

    // Load template as background (no text overlay from URL)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fabric as any).Image.fromURL(template.fullImageUrl, (img: any) => {
      img.scaleToWidth(CANVAS_WIDTH);
      img.set({ selectable: false, evented: false });
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
    }, { crossOrigin: 'anonymous' });

    const { namePosition } = template.suggestedLayout;

    // "Agenda" text — above the name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agendaText = new (fabric as any).IText('Agenda', {
      left: namePosition.x,
      top: namePosition.y - 110,
      fontFamily: namePosition.fontFamily,
      fontSize: Math.round(namePosition.fontSize * 0.55),
      fill: namePosition.color,
      editable: true,
    });
    fabricCanvas.add(agendaText);

    // Year text — between "Agenda" and name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yearText = new (fabric as any).IText(CURRENT_YEAR, {
      left: namePosition.x,
      top: namePosition.y - 60,
      fontFamily: namePosition.fontFamily,
      fontSize: Math.round(namePosition.fontSize * 0.45),
      fill: namePosition.color,
      editable: true,
    });
    fabricCanvas.add(yearText);

    // Name text
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nameText = new (fabric as any).IText('Seu Nome', {
      left: namePosition.x,
      top: namePosition.y,
      fontFamily: namePosition.fontFamily,
      fontSize: namePosition.fontSize,
      fill: namePosition.color,
      editable: true,
    });
    fabricCanvas.add(nameText);
    setNameObject(nameText);

    setCanvas(fabricCanvas);
    setIsLoading(false);

    return () => fabricCanvas.dispose();
  }, [template]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const addLogo = useCallback(async (imageUrl: string) => {
    if (!canvas || !template) return;
    const { fabric } = await import('fabric');

    if (logoObject) {
      canvas.remove(logoObject);
    }

    const { logoPosition } = template.suggestedLayout;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fabric as any).Image.fromURL(imageUrl, (img: any) => {
      img.scaleToWidth(logoPosition.width);
      img.set({ left: logoPosition.x, top: logoPosition.y });
      canvas.add(img);
      canvas.setActiveObject(img);
      setLogoObject(img);
      canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
  }, [canvas, template, logoObject]);

  const addText = useCallback(async (text = 'Novo Texto') => {
    if (!canvas) return;
    const { fabric } = await import('fabric');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newText = new (fabric as any).IText(text, {
      left: CANVAS_WIDTH / 2 - 80,
      top: CANVAS_HEIGHT / 2,
      fontFamily: 'Montserrat',
      fontSize: 32,
      fill: '#ffffff',
      editable: true,
    });
    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.renderAll();
  }, [canvas]);

  const deleteSelected = useCallback(() => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.renderAll();
    }
  }, [canvas]);

  const updateNameText = useCallback((text: string) => {
    if (!nameObject) return;
    nameObject.set('text', text);
    canvas?.renderAll();
  }, [nameObject, canvas]);

  const updateNameFont = useCallback((fontFamily: string) => {
    if (!nameObject) return;
    nameObject.set('fontFamily', fontFamily);
    canvas?.renderAll();
  }, [nameObject, canvas]);

  const updateNameColor = useCallback((color: string) => {
    if (!nameObject) return;
    nameObject.set('fill', color);
    canvas?.renderAll();
  }, [nameObject, canvas]);

  const updateNameSize = useCallback((size: number) => {
    if (!nameObject) return;
    nameObject.set('fontSize', size);
    canvas?.renderAll();
  }, [nameObject, canvas]);

  const exportHighRes = useCallback(() => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL(generateExportOptions());
    downloadFile(dataUrl, 'agenda-capa.png');
    return dataUrl;
  }, [canvas]);

  const getPreviewDataUrl = useCallback(() => {
    if (!canvas) return null;
    return canvas.toDataURL({ format: 'png', quality: 0.8 });
  }, [canvas]);

  return {
    canvasRef,
    canvas,
    isLoading,
    addLogo,
    addText,
    deleteSelected,
    updateNameText,
    updateNameFont,
    updateNameColor,
    updateNameSize,
    exportHighRes,
    getPreviewDataUrl,
  };
}
