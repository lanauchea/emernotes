import { useLoaderData } from "react-router";
import { buildSeo } from "@/shared/seo";

export async function loader({ request }) {
  const url = process.env.BASE_URL + new URL(request.url).pathname;

  const seo = buildSeo({
    title: "About",
    description:
      "About EmerNotes simple friendly note-taking app, what's and why's",
    noindex: false,
    url,
  });

  return { title: "Emernotes", seo };
}

export default function About() {
  const { title, seo } = useLoaderData();
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
      <h2>About {title}</h2>
      <p className="text-sm tracking-tight">
        Emernotes is a simple yet friendly note-taking app built for everybody.
      </p>
    </>
  );
}
