import Script from "next/script";

export default function Home() {
  return (
    <>
      <Script
        id="home-redirect"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.setTimeout(function () {
  window.location.replace('/index.html');
}, 800);
          `,
        }}
      />
      <main className="flex min-h-screen items-center justify-center bg-[#003956] px-6 text-center text-white">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
            MB Finance
          </p>
          <h1 className="mt-4 text-2xl font-bold">Redirecionando para o site...</h1>
        </div>
      </main>
    </>
  );
}
