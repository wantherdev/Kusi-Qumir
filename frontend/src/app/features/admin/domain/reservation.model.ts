export const RESERVATION_STATUSES = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'CONFIRMED', label: 'Confirmada' },
  { value: 'COMPLETED', label: 'Completada' },
  { value: 'CANCELLED', label: 'Cancelada' },
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number]['value'];
export type ReservationInput = {
  tourId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  travelDate: string;
  passengers: number;
  totalAmount: number;
  paidAmount: number;
  status: ReservationStatus;
  notes: string;
};
export type Reservation = ReservationInput & {
  id: string;
  code: string;
  tourTitle: string;
  currency: 'PEN';
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
export type ReservationPage = { items: Reservation[]; total: number };
export type ReservationQuery = { page: number; name: string; status: string; deleted: boolean };
export const RESERVATION_PAGE_SIZE = 25;
export function reservationStatusLabel(status: ReservationStatus): string {
  return RESERVATION_STATUSES.find((item) => item.value === status)?.label ?? status;
}
export function travelDateLabel(value: string): string {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}
export function normalizeReservation(value: ReservationInput): ReservationInput {
  const date = new Date(`${value.travelDate}T12:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value.travelDate) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value.travelDate ||
    !value.tourId ||
    value.customerName.trim().length < 2 ||
    value.customerName.trim().length > 150 ||
    value.customerPhone.trim().length < 3 ||
    value.customerPhone.trim().length > 40 ||
    !Number.isInteger(value.passengers) ||
    value.passengers < 1 ||
    value.passengers > 100 ||
    !Number.isFinite(value.totalAmount) ||
    !Number.isFinite(value.paidAmount) ||
    value.totalAmount < 0 ||
    value.totalAmount > 99999999.99 ||
    value.paidAmount < 0 ||
    value.paidAmount > value.totalAmount ||
    Math.abs(value.totalAmount * 100 - Math.round(value.totalAmount * 100)) > 0.00001 ||
    Math.abs(value.paidAmount * 100 - Math.round(value.paidAmount * 100)) > 0.00001 ||
    !RESERVATION_STATUSES.some((status) => status.value === value.status) ||
    value.notes.length > 4000 ||
    (value.customerEmail &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.customerEmail.trim()) ||
        value.customerEmail.trim().length > 254))
  ) {
    throw new Error(
      'Revisa los datos de la reserva: fecha válida, contacto, pasajeros y montos con hasta dos decimales. El abono no puede superar el total.',
    );
  }
  return {
    ...value,
    customerName: value.customerName.trim(),
    customerPhone: value.customerPhone.trim(),
    customerEmail: value.customerEmail?.trim() || null,
    notes: value.notes.trim(),
  };
}
