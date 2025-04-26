export interface HTTPResponse<T> {
  success: boolean;
  total?: number;
  data?: T;
  message?: string;
  token?: string;
}
export interface IRecentConversation {
  friendId: string;
  name: string;
  lastText: string;
  timestamp: string;
  conversationId: string;
  friendImage: string;
  isGroup: boolean;
}

export interface IFriendList {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
}

/// USER CHAT INTERFACE

export interface IChatData {
  id: string;
  createdAt: Date;
  ConversationParticipant?: ConversationParticipant[];
  Messages?: Message[];
}

export interface ConversationParticipant {
  name: string;
  id: string;
}

export interface Message {
  senderId: string;
  text: string;
  timestamp: Date;
  name: string;
  fileUrl: string;
  status?: 'pending' | 'sent' | 'failed';
}

export interface IPostChat {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string | undefined;
  image: string | undefined;
}

export interface IMessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  fileUrl: string;
}

export interface ICreateGroup {
  name: string;
  users: string[];
}

export interface ICreateGroupResponse {
  id: string;
  name: string;
  createdAt: string;
  ConversationParticipant: {
    id: string;
    userId: string;
    conversationId: string;
  }[];
}
