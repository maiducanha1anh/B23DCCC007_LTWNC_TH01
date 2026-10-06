import { useMemo } from 'react';
import { calculateDeadlineInfo, type DeadlineCalculationResult } from '../utils/dateUtils';

export interface UseDeadlineReturn extends DeadlineCalculationResult {
  isUrgent: boolean; // Overdue or <= 2 days left
}

/**
 * Custom Hook: useDeadline
 * Reusable hook to calculate remaining days, overdue status, labels, and urgency
 *
 * @param deadline ISO Date string ('YYYY-MM-DD')
 * @param customBaseDate Optional reference date for testing or customized baseline
 * @returns {UseDeadlineReturn} Object containing daysRemaining, isOverdue, isToday, label, formattedDeadline, etc.
 */
export function useDeadline(
  deadline: string,
  customBaseDate?: Date
): UseDeadlineReturn {
  return useMemo(() => {
    const info = calculateDeadlineInfo(deadline, customBaseDate);
    const isUrgent = info.isOverdue || (info.daysRemaining <= 2 && info.daysRemaining >= 0);

    return {
      ...info,
      isUrgent,
    };
  }, [deadline, customBaseDate]);
}
