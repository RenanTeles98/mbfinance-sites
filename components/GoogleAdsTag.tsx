import Script from "next/script";

const GOOGLE_ADS_ID = "AW-18112641661";

export default function GoogleAdsTag() {
  return (
    <>
      <Script
        id="google-ads-tag-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-tag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />
    </>
  );
}
