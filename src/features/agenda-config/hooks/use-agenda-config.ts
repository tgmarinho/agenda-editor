import { useAgendaConfigStore } from '@/store/agenda-config-store';

export function useAgendaConfig() {
  const store = useAgendaConfigStore();
  return store;
}
