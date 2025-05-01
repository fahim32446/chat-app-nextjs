import { NextResponse } from 'next/server';
import { isToday, isYesterday, isThisWeek, format, parseISO } from 'date-fns';
import bcrypt from 'bcryptjs';
import { Message } from '@/types/types';

export async function handleRequest(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error: any) {
    console.error('[API ERROR]', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message || error },
      { status: 500 }
    );
  }
}

export function formatTimestamp(input: string | number | Date): string {
  const date = typeof input === 'string' ? parseISO(input) : new Date(input);

  if (isNaN(date.getTime())) return 'Invalid date';

  if (isToday(date)) {
    return format(date, 'hh:mm a'); // '10:42 AM'
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else if (isThisWeek(date, { weekStartsOn: 1 })) {
    return format(date, 'EEEE'); // 'Sunday'
  } else {
    return format(date, 'MMM d'); // 'Apr 2'
  }
}

const SALT_ROUNDS = 10;

export async function saltAndHashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export const getMessageDate = (timestamp: Date, index: number, messages: Message[]) => {
  if (index === 0) return true;

  const prevDate = new Date(messages[index - 1].timestamp).toDateString();
  const currentDate = new Date(timestamp).toDateString();
  return prevDate !== currentDate;
};
