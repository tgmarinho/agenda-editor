'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Bold, Italic } from 'lucide-react';
import { DECORATIVE_FONTS } from '@/lib/fonts';
import { useFontLoader } from '../hooks/use-font-loader';
import { cn } from '@/lib/utils';

interface TextSidebarProps {
  onNameChange: (name: string) => void;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onFontSizeChange: (size: number) => void;
  nameFontWeight?: string;
  nameFontStyle?: string;
  onFontWeightChange?: (weight: string) => void;
  onFontStyleChange?: (style: string) => void;
}

export function TextSidebar({
  onNameChange,
  onFontChange,
  onColorChange,
  onFontSizeChange,
  nameFontWeight = 'normal',
  nameFontStyle = 'normal',
  onFontWeightChange,
  onFontStyleChange,
}: TextSidebarProps) {
  const [name, setName] = useState('');
  const [selectedFont, setSelectedFont] = useState('Great Vibes');
  const [color, setColor] = useState('#c8a960');
  const [fontSize, setFontSize] = useState(48);
  const { fontsLoaded } = useFontLoader();

  const handleNameChange = (value: string) => {
    setName(value);
    onNameChange(value);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    onFontChange(font);
  };

  const handleColorChange = (value: string) => {
    setColor(value);
    onColorChange(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFontSizeChange = (value: any) => {
    const size = Array.isArray(value) ? value[0] : value;
    if (typeof size === 'number') {
      setFontSize(size);
      onFontSizeChange(size);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Seu Nome</Label>
        <Input
          id="name"
          placeholder="Digite seu nome..."
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Estilo</Label>
        <div className="flex gap-2">
          {onFontWeightChange && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={cn(nameFontWeight === 'bold' && 'bg-primary/10 border-primary')}
              onClick={() => onFontWeightChange(nameFontWeight === 'bold' ? 'normal' : 'bold')}
              title={nameFontWeight === 'bold' ? 'Remover negrito' : 'Negrito'}
            >
              <Bold className="w-4 h-4" />
            </Button>
          )}
          {onFontStyleChange && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={cn(nameFontStyle === 'italic' && 'bg-primary/10 border-primary')}
              onClick={() => onFontStyleChange(nameFontStyle === 'italic' ? 'normal' : 'italic')}
              title={nameFontStyle === 'italic' ? 'Remover itálico' : 'Itálico'}
            >
              <Italic className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fonte</Label>
        <div className="grid gap-2 max-h-48 overflow-y-auto">
          {DECORATIVE_FONTS.map((font) => (
            <button
              key={font.family}
              onClick={() => handleFontChange(font.family)}
              className={`text-left px-3 py-2 rounded border text-sm transition-colors ${
                selectedFont === font.family
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ fontFamily: fontsLoaded ? font.family : 'sans-serif' }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tamanho: {fontSize}px</Label>
        <Slider
          min={20}
          max={120}
          step={2}
          value={[fontSize]}
          onValueChange={handleFontSizeChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <div className="flex items-center gap-2">
          <input
            id="color"
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
          />
          <Input
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="font-mono text-sm"
          />
        </div>
        <div className="grid grid-cols-6 gap-1">
          {['#c8a960', '#ffffff', '#000000', '#8b0000', '#1a237e', '#1b5e20'].map((c) => (
            <button
              key={c}
              onClick={() => handleColorChange(c)}
              className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
