import { auth } from '@/auth';
import { handleRequest } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return handleRequest(async () => {
    const { name, users } = await request.json();
    const session = await auth();
    const senderId = session?.user.id;

    const allUsers = [...users, senderId];

    if (!session?.user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        createdAt: new Date(),
        name: name,
        ConversationParticipant: {
          create: allUsers.map((userId: string) => ({
            user: { connect: { id: userId } },
          })),
        },
      },
      include: {
        ConversationParticipant: true,
      },
    });

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { name: true },
    });

    return NextResponse.json({
      status: 201,
      data: {
        ...conversation,
        name: sender?.name,
      },
    });
  });
}
