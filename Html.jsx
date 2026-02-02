export function Html({ assetsMap, children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>EmerNotes</title>
        <meta
          name="description"
          content="A simple, friendly, note-taking app for everybody"
        />

        <link rel="icon" type="image/svg+xml" href="/react.svg" />

        {assetsMap.css.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>

      <body>
        <div id="root">{children}</div>
        {assetsMap.js.map((src) => (
          <script key={src} type="module" src={src} defer />
        ))}{" "}
      </body>
    </html>
  );
}
