export interface AgendaTemplate {
  id: string;
  name: string;
  slug: string;
  category: 'feminina' | 'masculina' | 'profissional' | 'elegante';
  thumbnailUrl: string;
  fullImageUrl: string;
  suggestedLayout: {
    namePosition: {
      x: number;
      y: number;
      fontSize: number;
      fontFamily: string;
      color: string;
    };
    logoPosition: {
      x: number;
      y: number;
      width: number;
    };
  };
  price: number;
  isActive: boolean;
  sortOrder: number;
}

export const TEMPLATE_CATEGORIES = [
  { value: 'feminina', label: 'Feminina' },
  { value: 'masculina', label: 'Masculina' },
  { value: 'profissional', label: 'Profissional' },
  { value: 'elegante', label: 'Elegante' },
] as const;
