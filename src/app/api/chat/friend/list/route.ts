import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      email: true,
    },
  });

  return NextResponse.json({
    status: 200,
    data: user,
  });
};
