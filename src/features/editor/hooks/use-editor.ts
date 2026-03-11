import { useCallback, useEffect, useRef, useState } from 'react';
import { type AgendaTemplate } from '@/types/template';
import { generateExportOptions, downloadFile } from '../utils';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../types';

const CURRENT_YEAR = new Date().getFullYear().toString();
const STORAGE_KEY_PREFIX = 'agenda-editor-state-';
const PERSIST_DEBOUNCE_MS = 400;

function getStorageKey(templateId: string) {
  return `${STORAGE_KEY_PREFIX}${templateId}`;
}

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, ms);
  };
  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  };
  return debounced;
}

export function useEditor(template: AgendaTemplate | null) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [canvas, setCanvas] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nameObject, setNameObject] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logoObject, setLogoObject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRestoringRef = useRef(false);

  const initCanvas = useCallback(async () => {
    if (!canvasRef.current || !template) return;

    const { fabric } = await import('fabric');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fabricCanvas = new (fabric as any).Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      preserveObjectStacking: true,
    });

    const storageKey = getStorageKey(template.id);
    const savedState = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

    const debouncedPersist = debounce(() => {
      if (!fabricCanvas || isRestoringRef.current) return;
      try {
        const full = fabricCanvas.toJSON();
        const state = { version: full.version, objects: full.objects };
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // ignore serialization errors
      }
    }, PERSIST_DEBOUNCE_MS);

    const onObjectChange = () => debouncedPersist();

    // Load template as background (no text overlay from URL)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fabric as any).Image.fromURL(template.fullImageUrl, (img: any) => {
      img.scaleToWidth(CANVAS_WIDTH);
      img.set({ selectable: false, evented: false });
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));

      const reapplyBackgroundAndFinish = () => {
        fabricCanvas.setBackgroundImage(img, () => {
          fabricCanvas.renderAll();
          const objs = fabricCanvas.getObjects();
          const nameObj = objs.find((o: { get: (k: string) => { editorRole?: string } }) => o.get?.('data')?.editorRole === 'name');
          const logoObj = objs.find((o: { get: (k: string) => { editorRole?: string } }) => o.get?.('data')?.editorRole === 'logo');
          if (nameObj) setNameObject(nameObj);
          if (logoObj) setLogoObject(logoObj);
          isRestoringRef.current = false;
          setCanvas(fabricCanvas);
          setIsLoading(false);
        });
      };

      if (savedState) {
        try {
          const parsed = JSON.parse(savedState) as { version?: string; objects?: unknown[] };
          const loadJson = Array.isArray(parsed.objects)
            ? { version: parsed.version ?? '5.3.0', objects: parsed.objects }
            : parsed;
          isRestoringRef.current = true;
          fabricCanvas.loadFromJSON(loadJson, () => {
            reapplyBackgroundAndFinish();
          });
        } catch {
          isRestoringRef.current = false;
          // fallback: create default content
          addDefaultTexts();
        }
      } else {
        addDefaultTexts();
      }

      function addDefaultTexts() {
        if (!template) return;
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

        // Name text (marked so we can find it after restore)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nameText = new (fabric as any).IText('Seu Nome', {
          left: namePosition.x,
          top: namePosition.y,
          fontFamily: namePosition.fontFamily,
          fontSize: namePosition.fontSize,
          fill: namePosition.color,
          editable: true,
          data: { editorRole: 'name' },
        });
        fabricCanvas.add(nameText);
        setNameObject(nameText);

        setCanvas(fabricCanvas);
        setIsLoading(false);
      }

      fabricCanvas.on('object:modified', onObjectChange);
      fabricCanvas.on('object:added', onObjectChange);
      fabricCanvas.on('object:removed', onObjectChange);
    }, { crossOrigin: 'anonymous' });

    return () => {
      debouncedPersist.cancel();
      fabricCanvas.off('object:modified', onObjectChange);
      fabricCanvas.off('object:added', onObjectChange);
      fabricCanvas.off('object:removed', onObjectChange);
      fabricCanvas.dispose();
    };
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
      img.set({ left: logoPosition.x, top: logoPosition.y, data: { editorRole: 'logo' } });
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

  const clearLocalState = useCallback((templateId?: string) => {
    if (typeof window === 'undefined') return;
    const id = templateId ?? template?.id;
    if (id) localStorage.removeItem(getStorageKey(id));
  }, [template?.id]);

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
    clearLocalState,
  };
}
