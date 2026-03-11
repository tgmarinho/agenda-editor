import { create } from 'zustand';

interface AgendaConfigState {
  mioloTypeId: string;
  mioloTypeName: string;
  availableColors: string[];
  daysPerPage: 1 | 2;
  calendarPosition: 'lateral' | 'footer';
  mioloColor: string;
  spiralColorId: string;
  spiralColorName: string;
  spiralColorHex: string;

  setMioloType: (id: string, name: string, colors: string[]) => void;
  setDaysPerPage: (days: 1 | 2) => void;
  setCalendarPosition: (position: 'lateral' | 'footer') => void;
  setMioloColor: (color: string) => void;
  setSpiralColor: (id: string, name: string, hex: string) => void;
}

export const useAgendaConfigStore = create<AgendaConfigState>((set) => ({
  mioloTypeId: '',
  mioloTypeName: '',
  availableColors: [],
  daysPerPage: 1,
  calendarPosition: 'lateral',
  mioloColor: '',
  spiralColorId: '',
  spiralColorName: '',
  spiralColorHex: '',

  setMioloType: (id, name, colors) =>
    set({ mioloTypeId: id, mioloTypeName: name, availableColors: colors, mioloColor: colors[0] ?? '' }),
  setDaysPerPage: (days) => set({ daysPerPage: days }),
  setCalendarPosition: (position) => set({ calendarPosition: position }),
  setMioloColor: (color) => set({ mioloColor: color }),
  setSpiralColor: (id, name, hex) => set({ spiralColorId: id, spiralColorName: name, spiralColorHex: hex }),
}));
