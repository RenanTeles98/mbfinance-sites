import { createSign } from "crypto";

const GA_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const GA_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GA_API_BASE = "https://analyticsdata.googleapis.com/v1beta";

export type GaOverviewMetric = {
  totalUsers: number;
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  averageSessionDuration: number;
};

export type GaTrendPoint = {
  date: string;
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
};

export type GaTopPage = {
  pagePath: string;
  pageTitle: string;
  screenPageViews: number;
  activeUsers: number;
  sessions: number;
};

export type GaGeoRow = {
  label: string;
  secondaryLabel?: string;
  activeUsers: number;
  sessions: number;
};

export type GaDemographicRow = {
  label: string;
  activeUsers: number;
};

export type GaOverviewResponse = {
  configured: boolean;
  siteKey?: string;
  siteName?: string;
  propertyId?: string;
  rangeLabel?: string;
  summary?: GaOverviewMetric;
  trend?: GaTrendPoint[];
  topPages?: GaTopPage[];
  topCountries?: GaGeoRow[];
  topRegions?: GaGeoRow[];
  genderBreakdown?: GaDemographicRow[];
  ageBreakdown?: GaDemographicRow[];
};

export type GaSiteConfig = {
  key: string;
  name: string;
  propertyId: string;
  clientEmail: string;
  privateKey: string;
};

export type GaSiteOption = {
  key: string;
  name: string;
  configured: boolean;
};

type RunReportRequest = {
  dimensions?: Array<{ name: string }>;
  metrics: Array<{ name: string }>;
  dateRanges: Array<{ startDate: string; endDate: string }>;
  orderBys?: unknown[];
  limit?: string;
  dimensionFilter?: unknown;
};

type RunReportResponse = {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
};

function getEnv(name: string) {
  return process.env[name]?.trim() || "";
}

const DEFAULT_SITE_KEY = "mb-finance";

const GA_SITE_NAMES: Record<string, string> = {
  "mb-finance": "MB Finance",
  "mb-negocios": "MB Negocios",
  fomenta: "Fomenta",
};

function normalizeSiteKey(value?: string) {
  const normalized = (value || DEFAULT_SITE_KEY)
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  return normalized || DEFAULT_SITE_KEY;
}

function toEnvPrefix(siteKey: string) {
  return siteKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}

function readJsonSiteConfigs() {
  const raw = getEnv("GA4_SITES");
  if (!raw) return [] as GaSiteConfig[];

  try {
    const parsed = JSON.parse(raw) as Array<Partial<GaSiteConfig>>;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((site) => ({
        key: normalizeSiteKey(site.key),
        name: site.name || GA_SITE_NAMES[normalizeSiteKey(site.key)] || site.key || "Site",
        propertyId: String(site.propertyId || "").trim(),
        clientEmail: String(site.clientEmail || "").trim(),
        privateKey: String(site.privateKey || "").trim(),
      }))
      .filter((site) => site.key);
  } catch {
    return [];
  }
}

function readEnvSiteConfig(siteKey: string): GaSiteConfig {
  const key = normalizeSiteKey(siteKey);
  const prefix = toEnvPrefix(key);
  const isDefault = key === DEFAULT_SITE_KEY;

  return {
    key,
    name: getEnv(`GA4_${prefix}_SITE_NAME`) || GA_SITE_NAMES[key] || key,
    propertyId:
      getEnv(`GA4_${prefix}_PROPERTY_ID`) ||
      (isDefault ? getEnv("GA4_PROPERTY_ID") : ""),
    clientEmail:
      getEnv(`GA4_${prefix}_CLIENT_EMAIL`) ||
      (isDefault ? getEnv("GA4_CLIENT_EMAIL") : getEnv("GA4_CLIENT_EMAIL")),
    privateKey:
      getEnv(`GA4_${prefix}_PRIVATE_KEY`) ||
      (isDefault ? getEnv("GA4_PRIVATE_KEY") : getEnv("GA4_PRIVATE_KEY")),
  };
}

function isConfigured(site: GaSiteConfig) {
  return Boolean(site.propertyId && site.clientEmail && site.privateKey);
}

export function getGa4SiteConfig(siteKey = DEFAULT_SITE_KEY) {
  const key = normalizeSiteKey(siteKey);
  const jsonSite = readJsonSiteConfigs().find((site) => site.key === key);
  return jsonSite || readEnvSiteConfig(key);
}

export function getGa4SiteOptions(): GaSiteOption[] {
  const configuredKeys = new Set<string>();
  const jsonSites = readJsonSiteConfigs();
  const options: GaSiteOption[] = jsonSites.map((site) => {
    configuredKeys.add(site.key);
    return {
      key: site.key,
      name: site.name,
      configured: isConfigured(site),
    };
  });

  Object.keys(GA_SITE_NAMES).forEach((key) => {
    if (configuredKeys.has(key)) return;
    const site = readEnvSiteConfig(key);
    options.push({
      key,
      name: site.name,
      configured: isConfigured(site),
    });
  });

  return options;
}

function normalizePrivateKey(value: string) {
  return value
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----\s*/, "-----BEGIN PRIVATE KEY-----\n")
    .replace(/\s*-----END PRIVATE KEY-----/, "\n-----END PRIVATE KEY-----");
}

export function hasGa4Config() {
  return isConfigured(getGa4SiteConfig(DEFAULT_SITE_KEY));
}

function base64UrlEncode(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getAccessToken(site: GaSiteConfig) {
  const clientEmail = site.clientEmail;
  const privateKey = normalizePrivateKey(site.privateKey);

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: GA_SCOPE,
      aud: GA_TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = signer.sign(privateKey, "base64url");
  const assertion = `${header}.${claim}.${signature}`;

  const response = await fetch(GA_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao autenticar no Google Analytics: ${errorText}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

async function runReport(
  accessToken: string,
  propertyId: string,
  body: RunReportRequest
) {
  const response = await fetch(
    `${GA_API_BASE}/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao consultar o GA4: ${errorText}`);
  }

  return (await response.json()) as RunReportResponse;
}

function toNumber(value?: string) {
  const parsed = Number(value || "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDateLabel(raw: string) {
  if (!/^\d{8}$/.test(raw)) return raw;
  return `${raw.slice(6, 8)}/${raw.slice(4, 6)}`;
}

function cleanDimensionValue(value?: string, fallback = "Nao informado") {
  const normalized = (value || "").trim();
  if (!normalized || normalized === "(not set)" || normalized === "unknown") {
    return fallback;
  }
  return normalized;
}

function normalizePagePath(value?: string) {
  let path = (value || "/").trim();

  try {
    if (/^https?:\/\//i.test(path)) {
      path = new URL(path).pathname;
    }
  } catch {
    path = value || "/";
  }

  path = path.split("?")[0]?.split("#")[0] || "/";

  try {
    path = decodeURIComponent(path);
  } catch {
    // Keep the original value when GA4 returns a partially encoded path.
  }

  path = path.toLowerCase().replace(/\/{2,}/g, "/");
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/$/, "");

  if (
    path === "/index" ||
    path === "/index.html" ||
    path === "/mb-finance-completo" ||
    path === "/index.html"
  ) {
    return "/";
  }

  return path.replace(/\.html$/, "");
}

function normalizePageTitle(value?: string) {
  return cleanDimensionValue(value, "Sem titulo")
    .replace(/\s+/g, " ")
    .trim();
}

function groupTopPages(rows: RunReportResponse["rows"]): GaTopPage[] {
  const pageMap = new Map<
    string,
    GaTopPage & { displayScore: number }
  >();

  rows?.forEach((row) => {
    const rawPath = row.dimensionValues?.[0]?.value || "/";
    const rawTitle = row.dimensionValues?.[1]?.value || "Sem titulo";
    const pagePath = normalizePagePath(rawPath);
    const pageTitle = normalizePageTitle(rawTitle);
    const screenPageViews = toNumber(row.metricValues?.[0]?.value);
    const activeUsers = toNumber(row.metricValues?.[1]?.value);
    const sessions = toNumber(row.metricValues?.[2]?.value);
    const existing = pageMap.get(pagePath);

    if (!existing) {
      pageMap.set(pagePath, {
        pagePath,
        pageTitle,
        screenPageViews,
        activeUsers,
        sessions,
        displayScore: screenPageViews,
      });
      return;
    }

    existing.screenPageViews += screenPageViews;
    existing.activeUsers += activeUsers;
    existing.sessions += sessions;

    if (screenPageViews > existing.displayScore && pageTitle !== "Sem titulo") {
      existing.pageTitle = pageTitle;
      existing.displayScore = screenPageViews;
    }
  });

  return Array.from(pageMap.values())
    .map((page) => ({
      pagePath: page.pagePath,
      pageTitle: page.pageTitle,
      screenPageViews: page.screenPageViews,
      activeUsers: page.activeUsers,
      sessions: page.sessions,
    }))
    .sort((a, b) => b.screenPageViews - a.screenPageViews)
    .slice(0, 10);
}

export async function getGa4Overview(siteKey = DEFAULT_SITE_KEY): Promise<GaOverviewResponse> {
  const site = getGa4SiteConfig(siteKey);

  if (!isConfigured(site)) {
    return {
      configured: false,
      siteKey: site.key,
      siteName: site.name,
    };
  }

  const propertyId = site.propertyId;
  const accessToken = await getAccessToken(site);

  const [
    summaryReport,
    trendReport,
    topPagesReport,
    topCountriesReport,
    topRegionsReport,
    genderReport,
    ageReport,
  ] = await Promise.all([
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "totalUsers" },
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
      ],
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: "30",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "activeUsers" },
        { name: "sessions" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "50",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: "10",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "region" }, { name: "country" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: "10",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "userGender" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: "10",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "userAgeBracket" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: "10",
    }),
  ]);

  const summaryRow = summaryReport.rows?.[0];
  const summary: GaOverviewMetric = {
    totalUsers: toNumber(summaryRow?.metricValues?.[0]?.value),
    activeUsers: toNumber(summaryRow?.metricValues?.[1]?.value),
    sessions: toNumber(summaryRow?.metricValues?.[2]?.value),
    screenPageViews: toNumber(summaryRow?.metricValues?.[3]?.value),
    averageSessionDuration: toNumber(summaryRow?.metricValues?.[4]?.value),
  };

  const trend: GaTrendPoint[] =
    trendReport.rows?.map((row) => ({
      date: formatDateLabel(row.dimensionValues?.[0]?.value || ""),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
      sessions: toNumber(row.metricValues?.[1]?.value),
      screenPageViews: toNumber(row.metricValues?.[2]?.value),
    })) || [];

  const topPages = groupTopPages(topPagesReport.rows);

  const topCountries: GaGeoRow[] =
    topCountriesReport.rows?.map((row) => ({
      label: cleanDimensionValue(
        row.dimensionValues?.[0]?.value,
        "Pais nao identificado"
      ),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
      sessions: toNumber(row.metricValues?.[1]?.value),
    })) || [];

  const topRegions: GaGeoRow[] =
    topRegionsReport.rows?.map((row) => ({
      label: cleanDimensionValue(
        row.dimensionValues?.[0]?.value,
        "Estado/regiao nao identificado"
      ),
      secondaryLabel: cleanDimensionValue(
        row.dimensionValues?.[1]?.value,
        "Pais nao identificado"
      ),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
      sessions: toNumber(row.metricValues?.[1]?.value),
    })) || [];

  const genderBreakdown: GaDemographicRow[] =
    genderReport.rows?.map((row) => ({
      label: cleanDimensionValue(row.dimensionValues?.[0]?.value),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
    })) || [];

  const ageBreakdown: GaDemographicRow[] =
    ageReport.rows?.map((row) => ({
      label: cleanDimensionValue(row.dimensionValues?.[0]?.value),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
    })) || [];

  return {
    configured: true,
    siteKey: site.key,
    siteName: site.name,
    propertyId,
    rangeLabel: "Ultimos 30 dias",
    summary,
    trend,
    topPages,
    topCountries,
    topRegions,
    genderBreakdown,
    ageBreakdown,
  };
}
