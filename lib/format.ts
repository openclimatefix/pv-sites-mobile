import dayjs from 'dayjs';

export function timeFormat(date: dayjs.Dayjs | Date) {
  return dayjs(date).format('h:mm A');
}

export function dayFormat(date: dayjs.Dayjs | Date) {
  return dayjs(date).format('M/DD');
}

export function weekdayFormat(date: dayjs.Dayjs | Date) {
  return dayjs(date).format('ddd h:mm A');
}
