import { formatDistanceToNowStrict, format } from 'date-fns';

export const formatDistanceToNow = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNowStrict(date, { addSuffix: true });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy • h:mm a');
};