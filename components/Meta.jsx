const AUTH_PATH_RE = /^\/(login|signup|auth|forgot-password|reset-password)/;

export function Meta(props) {
  const {
    title = "A simple, friendly, note-taking app for everybody",
    description = "A simple, friendly, note-taking app for everybody. Welcome to EmerNotes! Start your journey from now!",
    image = "/og.webp",
    url = process.env.BASE_URL,
    noindex,
  } = props;

  return (
    <>
      {title && <title>{`${title} | EmerNotes`}</title>}
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}

      {(noindex || AUTH_PATH_RE.test(url || "")) && (
        <meta name="robots" content="noindex,nofollow" />
      )}

      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:card" content="summary_large_image" />}
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
