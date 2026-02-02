export function createFetchRequest(request, response) {
  let origin = `${request.protocol}://${request.get("host")}`;
  let url = new URL(request.originalUrl || request.url, origin);

  let controller = new AbortController();
  response.on("close", () => controller.abort());

  let headers = new Headers();

  for (let [key, values] of Object.entries(request.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  let init = {
    method: request.method,
    headers,
    signal: controller.signal,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  return new Request(url.href, init);
}

export async function sendWebResponseToExpress(webResp, res) {
  // set status
  res.status(webResp.status || 200);

  // set headers
  for (const [k, v] of webResp.headers.entries()) {
    // use res.set for single-value headers; if the header might be repeated, append
    // but append doesn't exist on plain Node res - express has res.append.
    // prefer res.set (overwrites) which is fine for most headers from loaders/actions.
    if (res.append) {
      res.append(k, v);
    } else {
      res.setHeader(k, v);
    }
  }

  // stream/send body
  // prefer text() because body might be JSON/text
  const body = await webResp.text();
  res.send(body);
}
