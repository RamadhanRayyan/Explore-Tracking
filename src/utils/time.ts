/**
 * Parse "HH:mm" string to minutes from start of day
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 9 * 60; // default 09:00
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Format minutes from start of day to "HH:mm"
 */
export function minutesToTimeString(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Add minutes to a "HH:mm" string
 */
export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const currentMinutes = timeStringToMinutes(timeStr);
  return minutesToTimeString(currentMinutes + minutesToAdd);
}

/**
 * Format minutes into readable human duration, e.g. "4 jam 30 mnt" or "45 mnt"
 */
export function formatDurationHuman(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hrs === 0) {
    return `${mins} menit`;
  }
  if (mins === 0) {
    return `${hrs} jam`;
  }
  return `${hrs} jam ${mins} menit`;
}

/**
 * Check if a time interval [startMin, endMin] falls within place opening hours [openMin, closeMin]
 */
export function isPlaceOpenAtTime(
  arrivalTimeStr: string,
  openStr: string,
  closeStr: string
): boolean {
  if (openStr === '24 Jam' || openStr === '00:00' && closeStr === '23:59') {
    return true;
  }
  const arrivalMin = timeStringToMinutes(arrivalTimeStr);
  let openMin = timeStringToMinutes(openStr);
  let closeMin = timeStringToMinutes(closeStr);

  // If closes past midnight (e.g. 17:00 to 02:00)
  if (closeMin < openMin) {
    closeMin += 1440;
    if (arrivalMin < openMin) {
      return arrivalMin + 1440 <= closeMin;
    }
    return arrivalMin <= closeMin;
  }

  return arrivalMin >= openMin && arrivalMin <= closeMin;
}
