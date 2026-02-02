import { buildSeo } from "@/shared/seo";
import { Suspense } from "react";
import { Await } from "react-router";
import { useLoaderData } from "react-router";

export async function loader({ request }) {
  const data = new Promise((res) => {
    setTimeout(() => res("EmerNotes."), 2000);
  });

  const url = process.env.BASE_URL + new URL(request.url).pathname;

  const seo = buildSeo({
    title: "Home",
    noindex: false,
    url,
  });

  return { data, seo };
}

export default function Home() {
  const { data, seo } = useLoaderData();

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />

      <meta name="robots" content={seo.robots} />
      <link rel="canonical" href={seo.canonical} />

      <meta property="og:type" content={seo.og.type} />
      <meta property="og:title" content={seo.og.title} />
      <meta property="og:description" content={seo.og.description} />
      <meta property="og:url" content={seo.og.url} />
      <meta property="og:image" content={seo.og.image} />
      <meta property="og:site_name" content={seo.og.site_name} />

      <meta name="twitter:card" content={seo.twitter.card} />
      <meta name="twitter:title" content={seo.twitter.title} />
      <meta name="twitter:description" content={seo.twitter.description} />
      <meta name="twitter:image" content={seo.twitter.image} />

      <h2>Homepage!</h2>

      <Suspense
        fallback={
          <p className="text-center animate-pulse text-neutral-800">Wait...</p>
        }
      >
        <Await resolve={data}>
          {(message) => (
            <p className="text-center text-sm text-neutral-900">{message}</p>
          )}
        </Await>
      </Suspense>
    </>
  );
}
