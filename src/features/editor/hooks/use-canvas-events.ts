import { useEffect } from 'react';

interface UseCanvasEventsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionCreated?: (obj: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionUpdated?: (obj: any) => void;
  onSelectionCleared?: () => void;
  onObjectModified?: () => void;
}

export function useCanvasEvents({
  canvas,
  onSelectionCreated,
  onSelectionUpdated,
  onSelectionCleared,
  onObjectModified,
}: UseCanvasEventsProps) {
  useEffect(() => {
    if (!canvas) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectionCreated = (e: any) => {
      const selected = e.selected?.[0];
      if (selected) onSelectionCreated?.(selected);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectionUpdated = (e: any) => {
      const selected = e.selected?.[0];
      if (selected) onSelectionUpdated?.(selected);
    };

    const handleSelectionCleared = () => {
      onSelectionCleared?.();
    };

    const handleObjectModified = () => {
      onObjectModified?.();
    };

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', handleObjectModified);

    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas, onSelectionCreated, onSelectionUpdated, onSelectionCleared, onObjectModified]);
}
