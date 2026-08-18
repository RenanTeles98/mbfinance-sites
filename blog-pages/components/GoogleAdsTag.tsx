import Script from "next/script";

const googleAdsId = "AW-18112641661";

export default function GoogleAdsTag() {
  return (
    <>
      <Script id="google-ads-tag-loader" src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`} strategy="afterInteractive" />
      <Script
        id="google-ads-tag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAdsId}');
          `,
        }}
      />
    </>
  );
}
