import { Client, LeaveRecord, PaymentRecord, PaymentStatus } from '../types';
import { getTodayDateString } from './dateUtils';

export const formatCurrency = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('en-IN');
};

export const getMonthsListBetween = (startMonthStr: string, endMonthStr: string): string[] => {
  const months: string[] = [];
  if (!startMonthStr || !endMonthStr || startMonthStr > endMonthStr) {
    return [endMonthStr || getTodayDateString().slice(0, 7)];
  }

  let [startYear, startMonth] = startMonthStr.split('-').map(Number);
  const [endYear, endMonth] = endMonthStr.split('-').map(Number);

  while (startYear < endYear || (startYear === endYear && startMonth <= endMonth)) {
    const monthFormatted = `${startYear}-${String(startMonth).padStart(2, '0')}`;
    months.push(monthFormatted);

    startMonth++;
    if (startMonth > 12) {
      startMonth = 1;
      startYear++;
    }
  }

  return months;
};

export const formatMonthName = (monthStr: string): string => {
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const getClientCurrentMonthPaymentStatus = (
  client: Client,
  payments: PaymentRecord[],
  targetMonthStr?: string,
  leaves?: LeaveRecord[]
): {
  status: PaymentStatus;
  paidAmount: number;
  dueAmount: number;
  remainingBalance: number;
  unpaidMonthsCount: number;
  unpaidMonthsNames: string[];
} => {
  const currentMonthStr = targetMonthStr || getTodayDateString().slice(0, 7); // e.g. "2026-08"
  
  // STRICT RULE: Fee journal and pending fee tracking operates STRICTLY from August 2026 (2026-08) onwards!
  // Any months prior to August 2026 (July 2026 and earlier) are strictly excluded from pending fee calculations.
  const MIN_FEE_START_MONTH = '2026-08';
  let rawJoiningMonthStr = (client.joiningDate || getTodayDateString()).slice(0, 7);
  let effectiveJoiningMonthStr = rawJoiningMonthStr < MIN_FEE_START_MONTH ? MIN_FEE_START_MONTH : rawJoiningMonthStr;
  
  const activeMonths = getMonthsListBetween(
    effectiveJoiningMonthStr <= currentMonthStr ? effectiveJoiningMonthStr : currentMonthStr, 
    currentMonthStr
  );

  let totalDueSinceJoining = 0;
  const unpaidMonthsNames: string[] = [];

  activeMonths.forEach(mStr => {
    const isOnFullMonthLeave = leaves ? leaves.some(l => {
      if (l.clientId !== client.id) return false;
      if (l.isFullMonthLeave) {
        const leaveMonth = (l.startDate || l.date || '').slice(0, 7);
        return leaveMonth === mStr;
      }
      const start = l.startDate || l.date || '';
      const end = l.endDate || start;
      if ((start || '').startsWith(mStr) && (end || '').startsWith(mStr)) {
        const startDay = parseInt(start.split('-')[2], 10);
        const endDay = parseInt(end.split('-')[2], 10);
        return startDay <= 5 && endDay >= 25;
      }
      return false;
    }) : false;

    if (!isOnFullMonthLeave) {
      if (client.feeType === 'Per Session') {
        const perSessionRate = client.perSessionFee || 1000;
        if (mStr === currentMonthStr) {
          totalDueSinceJoining += (client.completedClasses || 0) * perSessionRate;
        } else {
          totalDueSinceJoining += 8 * perSessionRate;
        }
      } else {
        totalDueSinceJoining += client.monthlyFee || 0;
      }
    }
  });

  const clientPayments = payments.filter(p => p.clientId === client.id);
  const totalPaidAllTime = clientPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const cumulativeRemainingBalance = Math.max(0, totalDueSinceJoining - totalPaidAllTime);

  const currentMonthPayments = clientPayments.filter(p => (p.date || '').startsWith(currentMonthStr));
  const paidAmount = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);

  let dueAmount = 0;
  if (client.feeType === 'Per Session') {
    dueAmount = (client.completedClasses || 0) * (client.perSessionFee || 1000);
  } else {
    dueAmount = client.monthlyFee || 0;
  }

  let tempPaid = totalPaidAllTime;
  activeMonths.forEach(mStr => {
    let mDue = client.monthlyFee || 0;
    if (client.feeType === 'Per Session') {
      mDue = mStr === currentMonthStr ? (client.completedClasses || 0) * (client.perSessionFee || 1000) : 8 * (client.perSessionFee || 1000);
    }
    if (tempPaid >= mDue) {
      tempPaid -= mDue;
    } else {
      tempPaid = 0;
      unpaidMonthsNames.push(formatMonthName(mStr));
    }
  });

  let status: PaymentStatus = 'Pending';
  let finalRemainingBalance = cumulativeRemainingBalance;

  // STRICT PERSISTENCE: If client is explicitly marked Paid, enforce Paid status & 0 balance!
  if (client.paymentStatus === 'Paid') {
    status = 'Paid';
    finalRemainingBalance = 0;
  } else if (client.paymentStatus === 'Pending' || client.paymentStatus === 'Overdue') {
    status = client.paymentStatus;
    if (finalRemainingBalance === 0) {
      finalRemainingBalance = client.feeType === 'Per Session' ? (client.perSessionFee || 1000) : (client.monthlyFee || 1200);
    }
  } else if (cumulativeRemainingBalance === 0) {
    status = 'Paid';
  } else {
    const today = new Date();
    const currentDayNum = today.getDate();
    const dueDayNum = parseInt(client.feeDueDate, 10) || 5;

    if (unpaidMonthsNames.length > 1 || (currentDayNum > dueDayNum && paidAmount === 0)) {
      status = 'Overdue';
    } else if (paidAmount > 0) {
      status = 'Partial';
    } else {
      status = 'Pending';
    }
  }

  return {
    status,
    paidAmount,
    dueAmount,
    remainingBalance: finalRemainingBalance,
    unpaidMonthsCount: unpaidMonthsNames.length,
    unpaidMonthsNames
  };
};
