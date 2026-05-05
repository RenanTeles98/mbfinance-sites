export const BLOG_BASE_URL =
  process.env.NEXT_PUBLIC_BLOG_URL?.replace(/\/$/, "") || "https://blog.mbfinance.com.br";

export const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL?.replace(/\/$/, "") || "https://mbfinance.com.br";

export function blogUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BLOG_BASE_URL}${normalizedPath}`;
}

export function mainSiteUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${MAIN_SITE_URL}${normalizedPath}`;
}
