export type Subscriber = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  active: boolean;
};

export type Campaign = {
  id: string;
  subject: string;
  previewText: string;
  body: string;
  sentAt: string;
  recipientCount: number;
};
