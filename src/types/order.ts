export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'IN_PRODUCTION'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Aguardando Pagamento',
  PAID: 'Pago',
  IN_PRODUCTION: 'Em Produção',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export interface MioloConfig {
  mioloTypeId: string;
  mioloTypeName: string;
  daysPerPage: 1 | 2;
  calendarPosition: 'lateral' | 'footer';
  mioloColor: string;
  spiralColorId: string;
  spiralColorName: string;
  spiralColorHex: string;
}
