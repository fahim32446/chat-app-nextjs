import { auth } from '@/auth';
import { handleRequest } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = auth(async (req: NextRequest & { auth: Session | null }) => {
  return handleRequest(async () => {
    const userId = req?.auth?.user?.id;

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
      // friendList,
    });
  });
});
