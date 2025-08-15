export type Message = {
  from?: string;
  body?: string;
};

export type Conversation = {
  id: string;
  title?: string;
  unread?: boolean;
};

export type Thread = {
  messages: Message[];
};
