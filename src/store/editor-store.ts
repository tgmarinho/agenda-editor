import { create } from 'zustand';

interface EditorState {
  selectedTool: 'select' | 'text' | 'image';
  selectedFont: string;
  selectedColor: string;
  fontSize: number;
  userName: string;
  userImageUrl: string | null;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;

  setSelectedTool: (tool: EditorState['selectedTool']) => void;
  setSelectedFont: (font: string) => void;
  setSelectedColor: (color: string) => void;
  setFontSize: (size: number) => void;
  setUserName: (name: string) => void;
  setUserImageUrl: (url: string | null) => void;
  setCanUndo: (can: boolean) => void;
  setCanRedo: (can: boolean) => void;
  setIsSaving: (saving: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedTool: 'select',
  selectedFont: 'Great Vibes',
  selectedColor: '#c8a960',
  fontSize: 48,
  userName: '',
  userImageUrl: null,
  canUndo: false,
  canRedo: false,
  isSaving: false,

  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedFont: (font) => set({ selectedFont: font }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setFontSize: (size) => set({ fontSize: size }),
  setUserName: (name) => set({ userName: name }),
  setUserImageUrl: (url) => set({ userImageUrl: url }),
  setCanUndo: (can) => set({ canUndo: can }),
  setCanRedo: (can) => set({ canRedo: can }),
  setIsSaving: (saving) => set({ isSaving: saving }),
}));
