export function Html({ children }) {
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
        <link rel="stylesheet" href="/static/style.css" />
      </head>

      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
