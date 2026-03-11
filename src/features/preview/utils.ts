export function getPageCount(daysPerPage: 1 | 2): number {
  const daysInYear = 365;
  return Math.ceil(daysInYear / daysPerPage);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
