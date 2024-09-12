import { addMonths as dfAddMonths, isBefore as dfIsBefore } from "date-fns"; // Importez une bibliothèque de gestion des dates

export function addMonths(date: Date, months: number): Date {
  return dfAddMonths(date, months);
}

export function isBefore(date1: Date, date2: Date): boolean {
  return dfIsBefore(date1, date2);
}