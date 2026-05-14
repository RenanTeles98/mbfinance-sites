import { createSign } from "crypto";

const GA_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const GA_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GA_API_BASE = "https://analyticsdata.googleapis.com/v1beta";

export type GaOverviewMetric = {
  pjLeadClicks: number;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  screenPageViews: number;
  eventCount: number;
  pagesPerSession: number;
  funnelConversionRate: number;
  averageSessionDuration: number;
  engagementRate: number;
  bounceRate: number;
};

export type GaPeriodComparison = {
  totalUsers: number;
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  eventCount: number;
  bounceRate: number;
};

export type GaTrendPoint = {
  date: string;
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  eventCount: number;
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

export type GaTrafficSource = {
  channel: string;
  source: string;
  medium: string;
  campaign: string;
  activeUsers: number;
  sessions: number;
  eventCount: number;
};

export type GaProductClick = {
  product: string;
  clicks: number;
};

export type GaChannelConversion = {
  channel: string;
  activeUsers: number;
  sessions: number;
  leads: number;
  conversionRate: number;
};

export type GaCampaignConversion = {
  source: string;
  medium: string;
  campaign: string;
  activeUsers: number;
  sessions: number;
  leads: number;
  conversionRate: number;
};

export type GaDeviceRow = {
  device: string;
  activeUsers: number;
  sessions: number;
  leads: number;
  conversionRate: number;
};

export type GaLandingPageRow = {
  landingPage: string;
  activeUsers: number;
  sessions: number;
  leads: number;
  conversionRate: number;
};

export type GaUserTypeRow = {
  label: string;
  users: number;
  share: number;
};

export type GaCampaignRow = {
  source: string;
  medium: string;
  campaign: string;
  sessions: number;
  activeUsers: number;
};

export type GaOverviewResponse = {
  configured: boolean;
  siteKey?: string;
  siteName?: string;
  sites?: GaSiteConfigStatus[];
  propertyId?: string;
  rangeLabel?: string;
  summary?: GaOverviewMetric;
  trend?: GaTrendPoint[];
  topPages?: GaTopPage[];
  topCountries?: GaGeoRow[];
  topRegions?: GaGeoRow[];
  genderBreakdown?: GaDemographicRow[];
  ageBreakdown?: GaDemographicRow[];
  whatsappClicks?: number;
  generateLeadTotal?: number;
  modalOpenTotal?: number;
  c6AppClickTotal?: number;
  trafficSources?: GaTrafficSource[];
  productClicks?: GaProductClick[];
  channelConversions?: GaChannelConversion[];
  campaignConversions?: GaCampaignConversion[];
  deviceBreakdown?: GaDeviceRow[];
  landingPages?: GaLandingPageRow[];
  userTypes?: GaUserTypeRow[];
  previousPeriod?: GaPeriodComparison;
};

export type GaSiteConfigStatus = {
  key: string;
  name: string;
  configured: boolean;
};

type GaSiteConfig = GaSiteConfigStatus & {
  propertyId: string;
  clientEmail: string;
  privateKey: string;
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

function getBuiltInSites(): GaSiteConfig[] {
  const defaultClientEmail = getEnv("GA4_CLIENT_EMAIL");
  const defaultPrivateKey = getEnv("GA4_PRIVATE_KEY");
  const mbNegociosPropertyId = getEnv("GA4_MB_NEGOCIOS_PROPERTY_ID") || "536401937";
  const mbNegociosClientEmail = getEnv("GA4_MB_NEGOCIOS_CLIENT_EMAIL") || defaultClientEmail;
  const mbNegociosPrivateKey = getEnv("GA4_MB_NEGOCIOS_PRIVATE_KEY") || defaultPrivateKey;
  const fomentaPropertyId = getEnv("GA4_FOMENTA_PROPERTY_ID");
  const fomentaClientEmail = getEnv("GA4_FOMENTA_CLIENT_EMAIL") || defaultClientEmail;
  const fomentaPrivateKey = getEnv("GA4_FOMENTA_PRIVATE_KEY") || defaultPrivateKey;

  return [
    {
      key: "mb-finance",
      name: "MB Finance",
      propertyId: getEnv("GA4_PROPERTY_ID"),
      clientEmail: getEnv("GA4_CLIENT_EMAIL"),
      privateKey: getEnv("GA4_PRIVATE_KEY"),
      configured: hasGa4Config(),
    },
    {
      key: "mb-negocios",
      name: "MB Negócios",
      propertyId: mbNegociosPropertyId,
      clientEmail: mbNegociosClientEmail,
      privateKey: mbNegociosPrivateKey,
      configured: Boolean(mbNegociosPropertyId && mbNegociosClientEmail && mbNegociosPrivateKey),
    },
    {
      key: "fomenta",
      name: "Fomenta",
      propertyId: fomentaPropertyId,
      clientEmail: fomentaClientEmail,
      privateKey: fomentaPrivateKey,
      configured: Boolean(fomentaPropertyId && fomentaClientEmail && fomentaPrivateKey),
    },
  ];
}

function getConfiguredSites(): GaSiteConfig[] {
  const dynamicSites = getEnv("GA4_SITES");
  if (!dynamicSites) return getBuiltInSites();

  try {
    const parsed = JSON.parse(dynamicSites) as Array<Partial<GaSiteConfig>>;
    if (!Array.isArray(parsed)) return getBuiltInSites();
    return parsed
      .filter((site) => site.key && site.name)
      .map((site) => ({
        key: String(site.key),
        name: String(site.name),
        propertyId: String(site.propertyId || ""),
        clientEmail: String(site.clientEmail || ""),
        privateKey: String(site.privateKey || ""),
        configured: Boolean(site.propertyId && site.clientEmail && site.privateKey),
      }));
  } catch {
    return getBuiltInSites();
  }
}

function getSiteConfig(siteKey = "mb-finance") {
  const sites = getConfiguredSites();
  const selected = sites.find((site) => site.key === siteKey) || sites[0];
  return { selected, sites };
}

export function isGa4SiteConfigured(siteKey = "mb-finance") {
  return Boolean(getSiteConfig(siteKey).selected?.configured);
}

function base64UrlEncode(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getAccessToken(config?: Pick<GaSiteConfig, "clientEmail" | "privateKey">) {
  const clientEmail = config?.clientEmail || getEnv("GA4_CLIENT_EMAIL");
  const privateKey = normalizePrivateKey(config?.privateKey || getEnv("GA4_PRIVATE_KEY"));

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

function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getPreviousDateRange(startDate: string, endDate: string) {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  if (!start || !end || start > end) {
    return { startDate: "60daysAgo", endDate: "31daysAgo" };
  }

  const days = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1
  );
  const previousEnd = new Date(start);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setUTCDate(previousStart.getUTCDate() - days + 1);

  return {
    startDate: formatIsoDate(previousStart),
    endDate: formatIsoDate(previousEnd),
  };
}

function formatRangeLabel(startDate: string, endDate: string) {
  const today = formatIsoDate(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatIsoDate(yesterdayDate);

  if (startDate === today && endDate === today) return "Hoje";
  if (startDate === yesterday && endDate === yesterday) return "Ontem";

  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  if (!start || !end || start > end) return "Últimos 30 dias";

  const days = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1
  );
  if (endDate === today) {
    if (days === 7) return "Últimos 7 dias";
    if (days === 30) return "Últimos 30 dias";
    if (days === 90) return "Últimos 90 dias";
    if (days === 180) return "Últimos 180 dias";
    if (days >= 365 && days <= 366) return "Últimos 12 meses";
  }

  return `${startDate} até ${endDate}`;
}

function cleanDimensionValue(value?: string, fallback = "Nao informado") {
  const normalized = (value || "").trim();
  if (!normalized || normalized === "(not set)" || normalized === "unknown") {
    return fallback;
  }
  return normalized;
}

function getLeadEventFilter() {
  return {
    filter: {
      fieldName: "eventName",
      inListFilter: {
        values: ["generate_lead", "conta_pj_lead_click"],
      },
    },
  };
}

export async function getGa4Overview(
  siteKey = "mb-finance",
  startDate = "30daysAgo",
  endDate = "today"
): Promise<GaOverviewResponse> {
  const { selected, sites } = getSiteConfig(siteKey);
  const dateRange = { startDate, endDate };
  const previousDateRange = getPreviousDateRange(startDate, endDate);
  const siteStatuses = sites.map(({ key, name, configured }) => ({
    key,
    name,
    configured,
  }));

  if (!selected?.configured) {
    return {
      configured: false,
      siteKey: selected?.key || siteKey,
      siteName: selected?.name || siteKey,
      sites: siteStatuses,
    };
  }

  const propertyId = selected.propertyId;
  const accessToken = await getAccessToken(selected);

  const [
    summaryReport,
    pjLeadClicksReport,
    trendReport,
    topPagesReport,
    topCountriesReport,
    topRegionsReport,
    genderReport,
    ageReport,
  ] = await Promise.all([
    runReport(accessToken, propertyId, {
      dateRanges: [dateRange],
      metrics: [
        { name: "totalUsers" },
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "engagementRate" },
        { name: "bounceRate" },
        { name: "eventCount" },
        { name: "newUsers" },
      ],
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [dateRange],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: getLeadEventFilter(),
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [dateRange],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "eventCount" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: "30",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [dateRange],
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
      dateRanges: [dateRange],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: "10",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [dateRange],
      dimensions: [{ name: "region" }, { name: "country" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: "10",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [dateRange],
      dimensions: [{ name: "userGender" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: "10",
    }),
    runReport(accessToken, propertyId, {
      dateRanges: [dateRange],
      dimensions: [{ name: "userAgeBracket" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: "10",
    }),
  ]);

  const summaryRow = summaryReport.rows?.[0];
  const pjLeadClicksRow = pjLeadClicksReport.rows?.[0];
  const summary: GaOverviewMetric = {
    pjLeadClicks: toNumber(pjLeadClicksRow?.metricValues?.[0]?.value),
    totalUsers: toNumber(summaryRow?.metricValues?.[0]?.value),
    activeUsers: toNumber(summaryRow?.metricValues?.[1]?.value),
    sessions: toNumber(summaryRow?.metricValues?.[2]?.value),
    screenPageViews: toNumber(summaryRow?.metricValues?.[3]?.value),
    averageSessionDuration: toNumber(summaryRow?.metricValues?.[4]?.value),
    engagementRate: toNumber(summaryRow?.metricValues?.[5]?.value),
    bounceRate: toNumber(summaryRow?.metricValues?.[6]?.value),
    eventCount: toNumber(summaryRow?.metricValues?.[7]?.value),
    newUsers: toNumber(summaryRow?.metricValues?.[8]?.value),
    pagesPerSession: 0,
    funnelConversionRate: 0,
  };
  summary.pagesPerSession = summary.sessions
    ? summary.screenPageViews / summary.sessions
    : 0;
  summary.funnelConversionRate = summary.activeUsers
    ? summary.pjLeadClicks / summary.activeUsers
    : 0;

  const [
    whatsappResult,
    generateLeadResult,
    modalOpenResult,
    c6AppClickResult,
    trafficSourcesResult,
    productClicksResult,
    prevPeriodResult,
    channelTrafficResult,
    channelLeadResult,
    campaignLeadResult,
    deviceTrafficResult,
    deviceLeadResult,
    landingTrafficResult,
    landingLeadResult,
  ] =
    await Promise.allSettled([
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "whatsapp_click" } },
        },
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "generate_lead" } },
        },
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "lead_modal_open" } },
        },
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "c6_app_click" } },
        },
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [
          { name: "sessionSource" },
          { name: "sessionMedium" },
          { name: "sessionCampaignName" },
          { name: "sessionDefaultChannelGroup" },
        ],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "eventCount" },
        ],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: "12",
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { matchType: "BEGINS_WITH", value: "product_click_" } },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: "10",
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [previousDateRange],
        metrics: [
          { name: "totalUsers" },
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "eventCount" },
        ],
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: "12",
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: getLeadEventFilter(),
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: "12",
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [
          { name: "sessionSource" },
          { name: "sessionMedium" },
          { name: "sessionCampaignName" },
        ],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: getLeadEventFilter(),
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: "20",
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: "8",
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: getLeadEventFilter(),
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: "8",
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "landingPagePlusQueryString" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: "12",
      }),
      runReport(accessToken, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "landingPagePlusQueryString" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: getLeadEventFilter(),
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: "12",
      }),
    ]);

  const whatsappClicks =
    whatsappResult.status === "fulfilled"
      ? toNumber(whatsappResult.value.rows?.[0]?.metricValues?.[0]?.value)
      : 0;

  const generateLeadTotal =
    generateLeadResult.status === "fulfilled"
      ? toNumber(generateLeadResult.value.rows?.[0]?.metricValues?.[0]?.value)
      : 0;

  const modalOpenTotal =
    modalOpenResult.status === "fulfilled"
      ? toNumber(modalOpenResult.value.rows?.[0]?.metricValues?.[0]?.value)
      : 0;

  const c6AppClickTotal =
    c6AppClickResult.status === "fulfilled"
      ? toNumber(c6AppClickResult.value.rows?.[0]?.metricValues?.[0]?.value)
      : 0;

  const trafficSources: GaTrafficSource[] =
    trafficSourcesResult.status === "fulfilled"
      ? (trafficSourcesResult.value.rows?.map((row) => ({
          source: cleanDimensionValue(row.dimensionValues?.[0]?.value, "direto"),
          medium: cleanDimensionValue(row.dimensionValues?.[1]?.value, "nenhuma"),
          campaign: cleanDimensionValue(row.dimensionValues?.[2]?.value, "Sem campanha"),
          channel: cleanDimensionValue(row.dimensionValues?.[3]?.value, "Direto"),
          activeUsers: toNumber(row.metricValues?.[0]?.value),
          sessions: toNumber(row.metricValues?.[1]?.value),
          eventCount: toNumber(row.metricValues?.[2]?.value),
        })) ?? [])
      : [];

  const channelLeadMap = new Map<string, number>();
  if (channelLeadResult.status === "fulfilled") {
    channelLeadResult.value.rows?.forEach((row) => {
      const channel = cleanDimensionValue(row.dimensionValues?.[0]?.value, "Direto");
      channelLeadMap.set(channel, toNumber(row.metricValues?.[0]?.value));
    });
  }

  const channelConversions: GaChannelConversion[] =
    channelTrafficResult.status === "fulfilled"
      ? (channelTrafficResult.value.rows?.map((row) => {
          const channel = cleanDimensionValue(row.dimensionValues?.[0]?.value, "Direto");
          const activeUsers = toNumber(row.metricValues?.[0]?.value);
          const sessions = toNumber(row.metricValues?.[1]?.value);
          const leads = channelLeadMap.get(channel) || 0;
          return {
            channel,
            activeUsers,
            sessions,
            leads,
            conversionRate: activeUsers ? leads / activeUsers : 0,
          };
        }) ?? []).sort((a, b) => b.leads - a.leads || b.conversionRate - a.conversionRate || b.sessions - a.sessions)
      : [];

  const campaignMap = new Map<string, GaCampaignConversion>();
  trafficSources.forEach((row) => {
    const key = `${row.source}|||${row.medium}|||${row.campaign}`;
    campaignMap.set(key, {
      source: row.source,
      medium: row.medium,
      campaign: row.campaign,
      activeUsers: row.activeUsers,
      sessions: row.sessions,
      leads: 0,
      conversionRate: 0,
    });
  });
  if (campaignLeadResult.status === "fulfilled") {
    campaignLeadResult.value.rows?.forEach((row) => {
      const source = cleanDimensionValue(row.dimensionValues?.[0]?.value, "direto");
      const medium = cleanDimensionValue(row.dimensionValues?.[1]?.value, "nenhuma");
      const campaign = cleanDimensionValue(row.dimensionValues?.[2]?.value, "Sem campanha");
      const key = `${source}|||${medium}|||${campaign}`;
      const current = campaignMap.get(key) || {
        source,
        medium,
        campaign,
        activeUsers: 0,
        sessions: 0,
        leads: 0,
        conversionRate: 0,
      };
      current.leads = toNumber(row.metricValues?.[0]?.value);
      current.conversionRate = current.activeUsers ? current.leads / current.activeUsers : 0;
      campaignMap.set(key, current);
    });
  }
  const campaignConversions = Array.from(campaignMap.values())
    .map((row) => ({
      ...row,
      conversionRate: row.activeUsers ? row.leads / row.activeUsers : 0,
    }))
    .sort((a, b) => b.leads - a.leads || b.conversionRate - a.conversionRate || b.sessions - a.sessions)
    .slice(0, 12);

  const deviceLeadMap = new Map<string, number>();
  if (deviceLeadResult.status === "fulfilled") {
    deviceLeadResult.value.rows?.forEach((row) => {
      const device = cleanDimensionValue(row.dimensionValues?.[0]?.value, "Nao informado");
      deviceLeadMap.set(device, toNumber(row.metricValues?.[0]?.value));
    });
  }
  const deviceBreakdown: GaDeviceRow[] =
    deviceTrafficResult.status === "fulfilled"
      ? (deviceTrafficResult.value.rows?.map((row) => {
          const device = cleanDimensionValue(row.dimensionValues?.[0]?.value, "Nao informado");
          const activeUsers = toNumber(row.metricValues?.[0]?.value);
          const sessions = toNumber(row.metricValues?.[1]?.value);
          const leads = deviceLeadMap.get(device) || 0;
          return {
            device,
            activeUsers,
            sessions,
            leads,
            conversionRate: activeUsers ? leads / activeUsers : 0,
          };
        }) ?? [])
      : [];

  const landingLeadMap = new Map<string, number>();
  if (landingLeadResult.status === "fulfilled") {
    landingLeadResult.value.rows?.forEach((row) => {
      const landingPage = cleanDimensionValue(row.dimensionValues?.[0]?.value, "/");
      landingLeadMap.set(landingPage, toNumber(row.metricValues?.[0]?.value));
    });
  }
  const landingMap = new Map<string, GaLandingPageRow>();
  if (landingTrafficResult.status === "fulfilled") {
    landingTrafficResult.value.rows?.forEach((row) => {
      const landingPage = cleanDimensionValue(row.dimensionValues?.[0]?.value, "/");
      const current =
        landingMap.get(landingPage) ||
        {
          landingPage,
          activeUsers: 0,
          sessions: 0,
          leads: 0,
          conversionRate: 0,
        };
      current.activeUsers += toNumber(row.metricValues?.[0]?.value);
      current.sessions += toNumber(row.metricValues?.[1]?.value);
      landingMap.set(landingPage, current);
    });
  }
  landingLeadMap.forEach((leads, landingPage) => {
    const current =
      landingMap.get(landingPage) ||
      {
        landingPage,
        activeUsers: 0,
        sessions: 0,
        leads: 0,
        conversionRate: 0,
      };
    current.leads = leads;
    landingMap.set(landingPage, current);
  });
  const landingPages: GaLandingPageRow[] = Array.from(landingMap.values())
    .map((row) => ({
      ...row,
      conversionRate: row.activeUsers ? row.leads / row.activeUsers : 0,
    }))
    .sort((a, b) => b.leads - a.leads || b.sessions - a.sessions)
    .slice(0, 12);

  const returningUsers = Math.max(0, summary.totalUsers - summary.newUsers);
  const userTypes: GaUserTypeRow[] = [
    {
      label: "Novos usuarios",
      users: summary.newUsers,
      share: summary.totalUsers ? summary.newUsers / summary.totalUsers : 0,
    },
    {
      label: "Recorrentes",
      users: returningUsers,
      share: summary.totalUsers ? returningUsers / summary.totalUsers : 0,
    },
  ];

  const PRODUCT_NAMES: Record<string, string> = {
    "product_click_conta_corrente": "Conta Corrente Empresarial",
    "product_click_maquina_cartao": "Máquina de Cartão",
    "product_click_seguros": "Seguros e Consórcios",
    "product_click_credito_rapido": "Crédito Rápido",
    "product_click_tributarias": "Soluções Tributárias",
    "product_click_personalizadas": "Soluções Personalizadas",
    "product_click_telemedicina": "Telemedicina",
  };

  const productClicks: GaProductClick[] =
    productClicksResult.status === "fulfilled"
      ? (productClicksResult.value.rows
          ?.filter((row) => {
            const val = (row.dimensionValues?.[0]?.value || "").trim();
            return val && val.startsWith("product_click_");
          })
          .map((row) => {
            const eventName = row.dimensionValues?.[0]?.value || "";
            return {
              product: PRODUCT_NAMES[eventName] || eventName.replace("product_click_", "").replace(/_/g, " "),
              clicks: toNumber(row.metricValues?.[0]?.value),
            };
          }) ?? [])
      : [];

  const previousPeriod: GaPeriodComparison | undefined =
    prevPeriodResult.status === "fulfilled" && prevPeriodResult.value.rows?.[0]
      ? {
          totalUsers: toNumber(prevPeriodResult.value.rows[0].metricValues?.[0]?.value),
          activeUsers: toNumber(prevPeriodResult.value.rows[0].metricValues?.[1]?.value),
          sessions: toNumber(prevPeriodResult.value.rows[0].metricValues?.[2]?.value),
          screenPageViews: toNumber(prevPeriodResult.value.rows[0].metricValues?.[3]?.value),
          bounceRate: toNumber(prevPeriodResult.value.rows[0].metricValues?.[4]?.value),
          eventCount: toNumber(prevPeriodResult.value.rows[0].metricValues?.[5]?.value),
        }
      : undefined;

  const trend: GaTrendPoint[] =
    trendReport.rows?.map((row) => ({
      date: formatDateLabel(row.dimensionValues?.[0]?.value || ""),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
      sessions: toNumber(row.metricValues?.[1]?.value),
      screenPageViews: toNumber(row.metricValues?.[2]?.value),
      eventCount: toNumber(row.metricValues?.[3]?.value),
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
    siteKey: selected.key,
    siteName: selected.name,
    sites: siteStatuses,
    propertyId,
    rangeLabel: formatRangeLabel(startDate, endDate),
    summary,
    trend,
    topPages,
    topCountries,
    topRegions,
    genderBreakdown,
    ageBreakdown,
    whatsappClicks,
    generateLeadTotal,
    modalOpenTotal,
    c6AppClickTotal,
    trafficSources,
    productClicks,
    channelConversions,
    campaignConversions,
    deviceBreakdown,
    landingPages,
    userTypes,
    previousPeriod,
  };
}

export async function getCampaignData(
  startDate = "30daysAgo",
  endDate = "today",
  siteKey = "mb-finance"
): Promise<GaCampaignRow[]> {
  const { selected } = getSiteConfig(siteKey);
  if (!selected?.configured) return [];

  const propertyId = selected.propertyId;
  const accessToken = await getAccessToken(selected);

  try {
    const report = await runReport(accessToken, propertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: "sessionSource" },
        { name: "sessionMedium" },
        { name: "sessionCampaignName" },
      ],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
      ],
      dimensionFilter: {
        notExpression: {
          filter: {
            fieldName: "sessionCampaignName",
            stringFilter: { matchType: "EXACT", value: "(not set)" },
          },
        },
      },
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: "50",
    });

    return (report.rows || []).map((row) => ({
      source: cleanDimensionValue(row.dimensionValues?.[0]?.value, "desconhecido"),
      medium: cleanDimensionValue(row.dimensionValues?.[1]?.value, "desconhecido"),
      campaign: cleanDimensionValue(row.dimensionValues?.[2]?.value, "desconhecido"),
      sessions: toNumber(row.metricValues?.[0]?.value),
      activeUsers: toNumber(row.metricValues?.[1]?.value),
    }));
  } catch {
    return [];
  }
}
