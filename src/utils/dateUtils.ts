// Local-timezone safe date helper to prevent UTC offset shifts

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDayShortName = (dateStr?: string): string => {
  const d = dateStr ? new Date(dateStr) : new Date();
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
};

export const isDateInMonth = (dateStr: string | undefined | null, yearMonthStr: string): boolean => {
  if (!dateStr || !yearMonthStr) return false;
  if (dateStr.startsWith(yearMonthStr)) return true;

  const [targetYear, targetMonth] = yearMonthStr.split('-');
  const parts = dateStr.split(/[-/]/);

  if (parts.length === 3) {
    const p0 = parts[0].padStart(2, '0');
    const p1 = parts[1].padStart(2, '0');
    const p2 = parts[2].padStart(4, '0');

    if (parts[0].length === 4 && parts[0] === targetYear && p1 === targetMonth) return true;
    if (p2 === targetYear && p1 === targetMonth) return true;
    if (p2 === targetYear && p0 === targetMonth) return true;
  }

  return false;
};
