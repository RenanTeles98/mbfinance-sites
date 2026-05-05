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
  return Boolean(
    getEnv("GA4_PROPERTY_ID") &&
      getEnv("GA4_CLIENT_EMAIL") &&
      getEnv("GA4_PRIVATE_KEY")
  );
}

function base64UrlEncode(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getAccessToken() {
  const clientEmail = getEnv("GA4_CLIENT_EMAIL");
  const privateKey = normalizePrivateKey(getEnv("GA4_PRIVATE_KEY"));

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

export async function getGa4Overview(): Promise<GaOverviewResponse> {
  if (!hasGa4Config()) {
    return { configured: false };
  }

  const propertyId = getEnv("GA4_PROPERTY_ID");
  const accessToken = await getAccessToken();

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
      limit: "10",
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

  const topPages: GaTopPage[] =
    topPagesReport.rows?.map((row) => ({
      pagePath: row.dimensionValues?.[0]?.value || "/",
      pageTitle: row.dimensionValues?.[1]?.value || "Sem titulo",
      screenPageViews: toNumber(row.metricValues?.[0]?.value),
      activeUsers: toNumber(row.metricValues?.[1]?.value),
      sessions: toNumber(row.metricValues?.[2]?.value),
    })) || [];

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
