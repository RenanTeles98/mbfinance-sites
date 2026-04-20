import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { Subscriber, Campaign } from "@/types/newsletter";

const SUBS_KEY = "mb_newsletter_subscribers";
const CAMPS_KEY = "mb_newsletter_campaigns";

const isVercel = !!process.env.VERCEL;
const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

const localSubsPath = path.join(process.cwd(), "content/newsletter-subscribers.json");
const localCampsPath = path.join(process.cwd(), "content/newsletter-campaigns.json");
const tmpSubsPath = "/tmp/mb-newsletter-subscribers.json";
const tmpCampsPath = "/tmp/mb-newsletter-campaigns.json";

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

async function readLocalFile<T>(localPath: string, tmpPath: string): Promise<T[]> {
  const p = isVercel ? tmpPath : localPath;
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeLocalFile<T>(data: T[], localPath: string, tmpPath: string): Promise<void> {
  const p = isVercel ? tmpPath : localPath;
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf8");
}

export async function readSubscribers(): Promise<Subscriber[]> {
  if (hasKV) {
    try {
      const redis = getRedis();
      const data = await redis.get<Subscriber[]>(SUBS_KEY);
      return data || [];
    } catch { /* fallback */ }
  }
  return readLocalFile<Subscriber>(localSubsPath, tmpSubsPath);
}

export async function writeSubscribers(subscribers: Subscriber[]): Promise<void> {
  if (hasKV) {
    const redis = getRedis();
    await redis.set(SUBS_KEY, subscribers);
    return;
  }
  await writeLocalFile(subscribers, localSubsPath, tmpSubsPath);
}

export async function readCampaigns(): Promise<Campaign[]> {
  if (hasKV) {
    try {
      const redis = getRedis();
      const data = await redis.get<Campaign[]>(CAMPS_KEY);
      return data || [];
    } catch { /* fallback */ }
  }
  return readLocalFile<Campaign>(localCampsPath, tmpCampsPath);
}

export async function writeCampaigns(campaigns: Campaign[]): Promise<void> {
  if (hasKV) {
    const redis = getRedis();
    await redis.set(CAMPS_KEY, campaigns);
    return;
  }
  await writeLocalFile(campaigns, localCampsPath, tmpCampsPath);
}
