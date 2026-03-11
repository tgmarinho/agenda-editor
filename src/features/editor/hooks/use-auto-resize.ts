import { useEffect, useCallback } from 'react';
import type { RefObject } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAutoResize(canvas: any, containerRef: RefObject<HTMLDivElement>) {
  const autoResize = useCallback(() => {
    if (!canvas || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    canvas.setDimensions({ width: containerWidth, height: containerHeight });
    canvas.renderAll();
  }, [canvas, containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(autoResize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [autoResize, containerRef]);

  return { autoResize };
}
