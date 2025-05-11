//           User type            //
export interface UserType {
  id: string;
  email: string;
  username: string;
  user_unique_id: string;
  avatar: string;
  onlineStatus: boolean;
  friends: string[];
  FriendRequests: string[];
  channels: string[];
}

//      Friend request type       //
export interface FriendRequestSenderType {
  sender: {
    _id: string;
    username: string;
    user_unique_id: string;
    email: string;
    avatar: string;
  };
  requestId: string;
}

//          Friend type           //
export interface FriendType {
  Channels: string[];
  onlineStatus: boolean;
  _id: string;
  username: string;
  user_unique_id: string;
  email: string;
  avatar: string;
  date: string;
  friends: string[];
}

//          Filter type           //
export type filterFriendType = {
  action: {
    showAll: boolean;
    showOnline: boolean;
    showPending: boolean;
    openAddFriendForm: boolean;
    searchParams: string;
  };
};

//         Message type           //
export interface MessageType {
  sender: string;
  content: string;
  timestamp: string;
  type: "file" | "text" | "image" | "audio" | "video";
}

//           Chat type             //
export interface ChatType {
  chats: {
    _id: string;
    participants: string[];
    messages: MessageType[];
  }[];
  currentChat: string | null;
  currentChatMessages: MessageType[];
}

//          Channel type           //
export interface ChannelType {
  _id: string;
  channelName: string;
  channelDescription: string;
  channelAvatar: string;
  dateCreated: string;
  members: string[];
}
