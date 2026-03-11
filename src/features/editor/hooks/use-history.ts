import { useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useHistory(canvas: any) {
  const historyRef = useRef<string[]>([]);
  const currentIndexRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const saveState = useCallback(() => {
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    historyRef.current.push(json);
    currentIndexRef.current++;
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(false);
  }, [canvas]);

  const undo = useCallback(() => {
    if (!canvas || currentIndexRef.current <= 0) return;
    currentIndexRef.current--;
    const json = historyRef.current[currentIndexRef.current]!;
    canvas.loadFromJSON(JSON.parse(json), () => canvas.renderAll());
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(true);
  }, [canvas]);

  const redo = useCallback(() => {
    if (!canvas || currentIndexRef.current >= historyRef.current.length - 1) return;
    currentIndexRef.current++;
    const json = historyRef.current[currentIndexRef.current]!;
    canvas.loadFromJSON(JSON.parse(json), () => canvas.renderAll());
    setCanUndo(true);
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
  }, [canvas]);

  return { saveState, undo, redo, canUndo, canRedo };
}
