import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type RouteParamsWithId = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: RouteParamsWithId) {
  const conversationId = params?.id;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const userId = session?.user?.id;

  if (!conversationId) {
    return NextResponse.json({ message: 'Missing conversation id' }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ message: 'No user found' }, { status: 400 });
  }

  const allMatches = await prisma.conversation.findMany({
    where: {
      id: conversationId,
    },
    include: {
      ConversationParticipant: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      Messages: {
        orderBy: { timestamp: 'asc' },
        select: {
          senderId: true,
          text: true,
          timestamp: true,
          fileUrl: true,
          sender: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const transformedMatches = allMatches.map((match) => ({
    id: match.id,
    createdAt: match.createdAt,
    ConversationParticipant: match.ConversationParticipant.map(
      (p: { user: { name: any; id: any } }) => ({
        name: p.user.name,
        id: p.user.id,
      })
    ),
    Messages: match.Messages.map((m) => ({
      senderId: m.senderId,
      text: m.text,
      timestamp: m.timestamp,
      name: m.sender.name,
      fileUrl: m.fileUrl,
    })),
  }));

  return NextResponse.json({
    status: 201,
    data: transformedMatches[0] || null,
  });
}
