import { auth } from '@/auth';
import { handleRequest } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = auth(async (req: NextRequest & { auth: Session | null }) => {
  return handleRequest(async () => {
    const userId = '67ec113c13f70d865ddb340a';
    // const userId = req?.auth?.user?.id;

    // if (!userId) {
    //   return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    // }

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
  });
});
