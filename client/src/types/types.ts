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
  name: string;
  description: string;
  avatar: string;
  dateCreated: string;
  public: boolean;
  owner: string;
  members: ChannelMember[];
  categories: ChannelCategory[];
}

export interface ChannelCategory {
  _id: string;
  name: string;
  position: number;
  textChats: ChannelTextChatType[];
  voiceChats: ChannelVoiceChatType[];
}

export interface ChannelMember {
  _id: string;
  username: string;
  user_unique_id: string;
  avatar: string;
  onlineStatus: boolean;
  userServerRole: "admin" | "moderator" | "member";
}

export interface ChannelTextChatType {
  _id: string;
  name: string;
  type: "text" | "announcement";
  messages: MessageType[];
}

export interface ChannelVoiceChatType {
  _id: string;
  name: string;
  maxParticipants: number;
  connectedUsers: VoiceChatConnectedUsers[];
  isLocked: boolean;
  bitrate: number;
  permissions: VoiceChatPermissions;
}

interface VoiceChatConnectedUsers {
  user: string;
  joinedAt: string;
  voiceState: {
    muted: boolean;
    deafened: boolean;
    videoEnabled: boolean;
    screenSharing: boolean;
  };
}

interface VoiceChatPermissions {
  speakingAllowed: boolean;
  videoAllowed: boolean;
  screenShareAllowed: boolean;
}

export interface ServerInfo {
  _id: string;
  avatar: string;
  name: string;
  description: string;
  membersCount: string;
}
