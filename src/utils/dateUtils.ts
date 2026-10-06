/**
 * Date Utility Functions
 * Handles date normalization, calendar difference calculation, and formatting
 */

export interface DeadlineCalculationResult {
  daysRemaining: number; // Positive = future, Negative = overdue, 0 = today
  isOverdue: boolean;    // true if deadline < today
  isToday: boolean;      // true if deadline is today
  label: string;         // "Còn X ngày" | "Quá hạn X ngày" | "Hạn hôm nay"
  statusBadge: 'overdue' | 'today' | 'upcoming' | 'completed';
  formattedDeadline: string; // "DD/MM/YYYY"
}

/**
 * Normalizes a date to midnight (00:00:00) in local timezone
 */
export function normalizeDateToMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

/**
 * Parses 'YYYY-MM-DD' into a local Date object set to midnight
 */
export function parseISODate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day, 0, 0, 0, 0);
  }
  const fallback = new Date(dateStr);
  return normalizeDateToMidnight(fallback);
}

/**
 * Formats a Date or 'YYYY-MM-DD' string to 'DD/MM/YYYY'
 */
export function formatToVNDate(dateInput: Date | string): string {
  const date = typeof dateInput === 'string' ? parseISODate(dateInput) : dateInput;
  if (isNaN(date.getTime())) return dateInput.toString();

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Computes calendar day difference between deadline and a reference date (default: today)
 * 
 * Rules:
 * - deadline > today -> "Còn X ngày"
 * - deadline < today -> "Quá hạn X ngày"
 * - deadline === today -> "Hạn hôm nay"
 */
export function calculateDeadlineInfo(
  deadlineStr: string,
  baseDate: Date = new Date()
): DeadlineCalculationResult {
  const deadlineDate = parseISODate(deadlineStr);
  const today = normalizeDateToMidnight(baseDate);

  if (isNaN(deadlineDate.getTime())) {
    return {
      daysRemaining: 0,
      isOverdue: false,
      isToday: false,
      label: 'Ngày không hợp lệ',
      statusBadge: 'upcoming',
      formattedDeadline: deadlineStr,
    };
  }

  const diffMs = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const isToday = diffDays === 0;
  const isOverdue = diffDays < 0;

  let label: string;
  let statusBadge: DeadlineCalculationResult['statusBadge'];

  if (isToday) {
    label = 'Hạn hôm nay';
    statusBadge = 'today';
  } else if (diffDays > 0) {
    label = `Còn ${diffDays} ngày`;
    statusBadge = 'upcoming';
  } else {
    label = `Quá hạn ${Math.abs(diffDays)} ngày`;
    statusBadge = 'overdue';
  }

  return {
    daysRemaining: diffDays,
    isOverdue,
    isToday,
    label,
    statusBadge,
    formattedDeadline: formatToVNDate(deadlineDate),
  };
}

/**
 * Returns today formatted as 'YYYY-MM-DD' for date picker min/defaults
 */
export function getTodayISOString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
