"use client";

import { useEffect } from "react";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    mbTrackEvent?: (eventName: string, params?: AnalyticsParams) => void;
  }
}

export function pushAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
    ...params,
  });
}

function getElementText(element: Element | null) {
  return (element?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120);
}

function getPathFromUrl(url: string) {
  try {
    return new URL(url, window.location.href).pathname;
  } catch {
    return "";
  }
}

export default function AnalyticsTracker() {
  useEffect(() => {
    window.mbTrackEvent = pushAnalyticsEvent;

    const sentScrollDepths = new Set<number>();
    const scrollDepths = [25, 50, 75, 90];

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = Math.round((window.scrollY / scrollable) * 100);
      scrollDepths.forEach((depth) => {
        if (percent >= depth && !sentScrollDepths.has(depth)) {
          sentScrollDepths.add(depth);
          pushAnalyticsEvent("scroll_depth", { scroll_depth: depth });
        }
      });
    }

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const clickable = target.closest("a,button,[role='button']");
      if (!clickable) return;

      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      const clickText = getElementText(clickable);
      const analyticsLabel =
        (clickable as HTMLElement).dataset.analyticsLabel ||
        (link as HTMLElement | null)?.dataset.analyticsLabel ||
        clickText;
      const analyticsArea =
        (clickable as HTMLElement).dataset.analyticsArea ||
        (link as HTMLElement | null)?.dataset.analyticsArea ||
        "";

      if (link) {
        const href = link.href;
        const path = getPathFromUrl(href);

        if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
          pushAnalyticsEvent("whatsapp_click", {
            click_text: clickText,
            link_url: href,
            source_area: analyticsArea,
          });
        }

        if (path.startsWith("/blog/") && path !== "/blog") {
          pushAnalyticsEvent("blog_post_click", {
            post_path: path,
            post_title: analyticsLabel,
            source_area: analyticsArea || "blog",
          });
        }
      }

      const isMarkedCta = (clickable as HTMLElement).dataset.analyticsEvent === "cta_click";
      const looksLikeCta = /falar|simular|comparar|calcular|organizar|solicitar|quero|ler agora|ler artigo/i.test(clickText);

      if (isMarkedCta || looksLikeCta) {
        pushAnalyticsEvent("cta_click", {
          click_text: clickText,
          cta_label: analyticsLabel,
          source_area: analyticsArea,
        });
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick, true);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}
