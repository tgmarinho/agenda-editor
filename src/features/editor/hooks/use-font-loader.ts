import { useEffect, useState } from 'react';
import { DECORATIVE_FONTS, GOOGLE_FONTS_URL } from '@/lib/fonts';

export function useFontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);

    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const loadFont = async (fontFamily: string) => {
    await document.fonts.load(`16px "${fontFamily}"`);
  };

  return { fontsLoaded, loadFont, fonts: DECORATIVE_FONTS };
}
