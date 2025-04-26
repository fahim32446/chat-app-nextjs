import { auth } from '@/auth';
import { handleRequest } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/utils/pusher';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return handleRequest(async () => {
    const { senderId, receiverId, text, conversationId, image } = await request.json();

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let conversation;

    // 🚀 If it's a new conversation, just create it
    if (conversationId === 'new-conversation') {
      conversation = await prisma.conversation.create({
        data: {
          createdAt: new Date(),
          ConversationParticipant: {
            create: [
              { user: { connect: { id: senderId } } },
              { user: { connect: { id: receiverId } } },
            ],
          },
        },
        include: {
          ConversationParticipant: true,
        },
      });
    }
    // 🔍 Otherwise, find the existing conversation
    else {
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: {
          ConversationParticipant: true,
        },
      });

      if (!conversation) {
        return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
      }
    }

    // ✉️ Create the message
    const message = await prisma.messages.create({
      data: {
        senderId,
        conversationId: conversation.id,
        text,
        timestamp: new Date(),
        fileUrl: image,
      },
    });

    // 👤 Get sender name
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { name: true },
    });

    // 📢 Push the message to Pusher
    await pusherServer.trigger(`conversation-${conversation.id}`, 'new-message', {
      message: {
        ...message,
        name: sender?.name,
      },
    });

    // 📦 Return the new message
    return NextResponse.json({
      status: 201,
      message: {
        ...message,
        name: sender?.name,
      },
    });
  });
}
