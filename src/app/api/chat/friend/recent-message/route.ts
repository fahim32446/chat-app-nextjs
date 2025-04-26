import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      ConversationParticipant: {
        some: {
          userId: userId,
        },
      },
    },

    include: {
      ConversationParticipant: {
        include: {
          user: { select: { id: true, name: true, imageUrl: true } },
        },
      },
      Messages: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  });

  //@ts-ignore
  const friendList = conversations.map((item) => {
    const latestMessage = item.Messages[0] || null;

    // Get the other user in the conversation
    const friend = item.ConversationParticipant.find((p) => p.userId !== userId)?.user;

    return {
      friendId: friend?.id,
      conversationId: item.id,
      name: item.name ?? friend?.name,
      friendImage: friend?.imageUrl,
      lastText: latestMessage?.text ?? 'No messages yet',
      timestamp: latestMessage?.timestamp ?? null,
      isGroup: item.name ? true : false,
    };
  });

  // Sort by message time
  friendList.sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return (new Date(b.timestamp) as any) - (new Date(a.timestamp) as any);
  });

  return NextResponse.json({
    status: 200,
    data: friendList,
  });
};
