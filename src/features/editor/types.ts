export interface EditorObject {
  id: string;
  type: 'text' | 'image';
}

export interface TextProperties {
  fontFamily: string;
  fontSize: number;
  fill: string;
  fontWeight: string;
  fontStyle: string;
  underline: boolean;
  textAlign: string;
}

export interface CanvasWorkspace {
  width: number;
  height: number;
}

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 849; // A5 proporção

export const PRINT_WIDTH = 2480;
export const PRINT_HEIGHT = 3508;

export const CANVAS_MULTIPLIER = PRINT_WIDTH / CANVAS_WIDTH;
