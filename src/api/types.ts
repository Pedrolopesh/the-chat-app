export type PublicUser = { _id: string; name: string; img_profile: string };
export type Me = PublicUser & { email: string; emailVerifiedAt: string | null };

export type Message = { sender: "origin" | "response"; message: string; timestamp?: string };

export type Chat = {
  _id: string;
  user_origin: PublicUser[];
  user_response: PublicUser[];
  chatData: Message[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatEvent = Message & { chat_id: string };
