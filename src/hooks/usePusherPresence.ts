import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { useDispatch } from 'react-redux';
import { addUser, removeUser, setUsers } from '@/redux/slice/onlineUsersSlice';

export function usePusherPresence(userId?: string) {
  const dispatch = useDispatch();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/online',
      auth: {
        headers: { 'Content-Type': 'application/json' },
        params: { user: userId },
      },
    });

    const channel = pusher.subscribe('presence-online-users');

    channel.bind('pusher:subscription_succeeded', (members: any) => {
      const users: any = [];
      members.each((member: any) => {
        users.push(member.id);
      });
      dispatch(setUsers(users));
    });

    channel.bind('pusher:member_added', (member: any) => {
      dispatch(addUser(member.id));
    });

    channel.bind('pusher:member_removed', (member: any) => {
      dispatch(removeUser(member.id));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId, dispatch]);
}

export interface IUserOnline {
  members: { [key: string]: IUserInfo };
  count: number;
  myID: string;
  me: IUserMe;
}

export interface IUserMe {
  id: string;
  info: IUserInfo;
}

export interface IUserInfo {}
