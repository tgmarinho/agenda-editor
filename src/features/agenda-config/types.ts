export interface MioloType {
  id: string;
  name: string;
  availableColors: string[];
  description?: string;
}

export interface SpiralColor {
  id: string;
  name: string;
  hexColor: string;
  isActive: boolean;
}

export interface AgendaConfigOptions {
  mioloTypes: MioloType[];
  spiralColors: SpiralColor[];
}
