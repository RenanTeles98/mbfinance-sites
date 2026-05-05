export type Subscriber = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  active: boolean;
  tags: string[];
};

export type CampaignStats = {
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
};

export type Campaign = {
  id: string;
  subject: string;
  previewText: string;
  body: string;
  sentAt: string;
  recipientCount: number;
  targetTag?: string;
  stats?: CampaignStats;
};
