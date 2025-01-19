import { format, parseISO } from 'date-fns';

export const formatDate = (date: string | undefined | null) => {
  try {
    if (!date) {
      return 'Not available';
    }
    return format(parseISO(date), 'yyyy-MM-dd');
  } catch (error) {
    console.error('Invalid date format:', error);
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string) => {
  try {
    return format(parseISO(date), 'yyyy-MM-dd HH:mm:ss');
  } catch (error) {
    console.error('Invalid date format:', error);
    return date;
  }
}; 