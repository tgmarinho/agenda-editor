import { useCallback, useEffect, useRef, useState } from 'react';
import { type AgendaTemplate } from '@/types/template';
import { generateExportOptions, downloadFile } from '../utils';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../types';

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

    // Load template as background
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fabric as any).Image.fromURL(template.fullImageUrl, (img: any) => {
      img.scaleToWidth(CANVAS_WIDTH);
      img.set({ selectable: false, evented: false });
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
    }, { crossOrigin: 'anonymous' });

    // Add name text with suggested position
    const { namePosition } = template.suggestedLayout;
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
    updateNameText,
    updateNameFont,
    updateNameColor,
    updateNameSize,
    exportHighRes,
    getPreviewDataUrl,
  };
}
