import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * Get the current date in UTC format
 */
export const getCurrentDateInUTC = (): string => {
  return dayjs().utc().format();
};
export const getCurrentDateInUTCDate = (): Date => {
  return dayjs().utc().toDate();
};

/**
 * Convert a local date to UTC
 * @param date - Local date string or Date object
 */
export const convertToUTC = (date: string | Date): string => {
  return dayjs(date).utc().format();
};

export const convertToUTCDate = (date: string | Date): Date => {
  return dayjs(date).utc().toDate();
};

/**
 * Convert a UTC date to the user's local time zone
 * @param date - UTC date string
 */
export const convertFromUTC = (date: string): string => {
  return dayjs.utc(date).local().format();
};

/**
 * Get the start and end of a specific date or date range in UTC
 * @param args - Either {date} for a single date or {startDate, endDate} for a range
 * @returns An object containing the start and end times in UTC
 */
export const getStartAndEndOfDayInUTC = (
  args: {date: string} | {startDate: string; endDate: string},
): {start: string; end: string} => {
  const timeZone = dayjs.tz.guess();

  // Determine if the argument is a single date or a date range
  const {startDate, endDate} =
    'date' in args ? {startDate: args.date, endDate: args.date} : args;
  console.log('local', startDate, endDate);
  // Get start and end of day in the user's local timezone and convert to UTC
  const start = dayjs.tz(`${startDate}T00:00:00`, timeZone).utc().format();
  const end = dayjs.tz(`${endDate}T23:59:59`, timeZone).utc().format();
  console.log('utc', start, end);
  return {start, end};
};

/**
 * Get today's date in the user's local time zone (YYYY-MM-DD)
 */
export const getTodayDate = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

/**
 * Format a date in a readable way (e.g., 'DD MMM, YYYY')
 * @param date - Date string or Date object
 */
export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('DD MMM, YYYY');
};

/**
 * Check if a date is today, yesterday, or another day
 * @param date - Date string or Date object
 */
export const isTodayOrYesterday = (date: string | Date): string => {
  const inputDate = dayjs(date).startOf('day');
  const today = dayjs().startOf('day');
  const yesterday = today.subtract(1, 'day');

  if (inputDate.isSame(today, 'day')) {
    return 'Today';
  }
  if (inputDate.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }
  return formatDate(date);
};

/**
 * Format date in local timezone as '10:30 PM'
 * @param date - Date string or Date object
 */
export const formatTime = (date: string | Date): string => {
  return dayjs(date).format('h:mm A');
};

/**
 * Format date in local timezone as '10:30 PM, Mar 10, 25'
 * @param date - Date string or Date object
 */
export const formatTimeWithDate = (date: string | Date): string => {
  return dayjs(date).format('h:mm A, MMM D, YY');
};

export const isNow = (date: Date) => {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear() &&
    date.getHours() === now.getHours() &&
    date.getMinutes() === now.getMinutes()
  );
};
