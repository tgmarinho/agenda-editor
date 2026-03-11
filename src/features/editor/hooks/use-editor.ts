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
  const [nameFontWeight, setNameFontWeight] = useState<string>('normal');
  const [nameFontStyle, setNameFontStyle] = useState<string>('normal');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logoObject, setLogoObject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hasSelection, setHasSelection] = useState(false);
  const isRestoringRef = useRef(false);

  const ZOOM_MIN = 0.25;
  const ZOOM_MAX = 3;
  const ZOOM_STEP = 1.2;

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(ZOOM_MAX, prev * ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(ZOOM_MIN, prev / ZOOM_STEP));
  }, []);

  const zoomReset = useCallback(() => {
    setZoomLevel(1);
  }, []);

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

    const onSelectionCreated = () => setHasSelection(true);
    const onSelectionCleared = () => setHasSelection(false);
    fabricCanvas.on('selection:created', onSelectionCreated);
    fabricCanvas.on('selection:cleared', onSelectionCleared);

    const onObjectModified = (e: { target?: { get?: (k: string) => unknown } }) => {
      const target = e?.target;
      if (target?.get?.('data') && (target.get('data') as { editorRole?: string })?.editorRole === 'name') {
        setNameFontWeight((target.get('fontWeight') as string) ?? 'normal');
        setNameFontStyle((target.get('fontStyle') as string) ?? 'normal');
      }
      debouncedPersist();
    };

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
          if (nameObj) {
            setNameObject(nameObj);
            setNameFontWeight((nameObj.get('fontWeight') as string) ?? 'normal');
            setNameFontStyle((nameObj.get('fontStyle') as string) ?? 'normal');
          }
          if (logoObj) setLogoObject(logoObj);
          isRestoringRef.current = false;
          setCanvas(fabricCanvas);
          setIsLoading(false);
        });
      };

      if (savedState) {
        try {
          const parsed = JSON.parse(savedState) as { version?: string; objects?: unknown[] };
          const hasValidObjects = Array.isArray(parsed.objects);
          if (!hasValidObjects) {
            addDefaultTexts();
            return;
          }
          const loadJson = { version: parsed.version ?? '5.3.0', objects: parsed.objects };
          isRestoringRef.current = true;

          const RESTORE_TIMEOUT_MS = 5000;
          const restoreTimeoutId = setTimeout(() => {
            if (!isRestoringRef.current) return;
            isRestoringRef.current = false;
            setCanvas(fabricCanvas);
            setIsLoading(false);
          }, RESTORE_TIMEOUT_MS);

          fabricCanvas.loadFromJSON(loadJson, () => {
            clearTimeout(restoreTimeoutId);
            reapplyBackgroundAndFinish();
          });
        } catch {
          isRestoringRef.current = false;
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
        setNameFontWeight((nameText.get('fontWeight') as string) ?? 'normal');
        setNameFontStyle((nameText.get('fontStyle') as string) ?? 'normal');

        setCanvas(fabricCanvas);
        setIsLoading(false);
      }

      fabricCanvas.on('object:modified', onObjectModified);
      fabricCanvas.on('object:added', onObjectChange);
      fabricCanvas.on('object:removed', onObjectChange);
    }, { crossOrigin: 'anonymous' });

    return () => {
      debouncedPersist.cancel();
      fabricCanvas.off('selection:created', onSelectionCreated);
      fabricCanvas.off('selection:cleared', onSelectionCleared);
      fabricCanvas.off('object:modified', onObjectModified);
      fabricCanvas.off('object:added', onObjectChange);
      fabricCanvas.off('object:removed', onObjectChange);
      fabricCanvas.dispose();
    };
  }, [template]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  useEffect(() => {
    if (!canvas) return;
    canvas.setZoom(zoomLevel);
    canvas.renderAll();
  }, [canvas, zoomLevel]);

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

  const bringToFront = useCallback(() => {
    if (!canvas) return;
    const o = canvas.getActiveObject();
    if (o) {
      canvas.bringObjectToFront(o);
      canvas.renderAll();
    }
  }, [canvas]);

  const sendToBack = useCallback(() => {
    if (!canvas) return;
    const o = canvas.getActiveObject();
    if (o) {
      canvas.sendObjectToBack(o);
      canvas.renderAll();
    }
  }, [canvas]);

  const removeLogo = useCallback(() => {
    if (logoObject) {
      canvas?.remove(logoObject);
      setLogoObject(null);
      canvas?.renderAll();
    }
  }, [canvas, logoObject]);

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

  const updateNameFontWeight = useCallback((weight: string) => {
    if (!nameObject) return;
    nameObject.set('fontWeight', weight);
    setNameFontWeight(weight);
    canvas?.renderAll();
  }, [nameObject, canvas]);

  const updateNameFontStyle = useCallback((style: string) => {
    if (!nameObject) return;
    nameObject.set('fontStyle', style);
    setNameFontStyle(style);
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
    getPreviewDataUrl,
    clearLocalState,
    zoomLevel,
    zoomIn,
    zoomOut,
    zoomReset,
  };
}
