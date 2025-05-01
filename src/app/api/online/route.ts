import { pusherServer } from '@/utils/pusher';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  //   const body = await req.json();

  //   console.log({ body });

  //   const { socket_id, channel_name, user } = body;

  //   const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
  //     user_id: user.id,
  //     user_info: {
  //       name: user.name,
  //       email: user.email,
  //     },
  //   });

  //   return NextResponse.json(auth);

  const formData = await req.formData();
  const socket_id = formData.get('socket_id') as string;
  const channel_name = formData.get('channel_name') as string;
  const user = formData.get('user') as string; // optional

  const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
    user_id: user ?? 'anonymous',
    user_info: {},
  });

  console.log(auth);

  return NextResponse.json(auth);
}
