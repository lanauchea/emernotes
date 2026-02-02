const URL = process.env.BASE_URL;
const SITE_NAME = "EmerNotes";
const DEFAULT_IMAGE = "/og.webp";

export function buildSeo({
  title,
  description = "A simple, friendly, note-taking app for everybody",
  url = URL,
  image = DEFAULT_IMAGE,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    title: fullTitle,
    description,

    robots: noindex ? "noindex,nofollow" : "index,follow",
    canonical: url,

    og: {
      type: "website",
      title: fullTitle,
      description,
      url,
      image,
      site_name: SITE_NAME,
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      image,
    },
  };
}
