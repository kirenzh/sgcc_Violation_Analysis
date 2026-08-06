export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  const HOST = process.env.HOST;
  const UUID = process.env.UUID;
  const AUTH_KEY = process.env.AUTH_KEY;
  const AUTH_SECRET = process.env.AUTH_SECRET;

  const params = new URLSearchParams({
    uuid: UUID,
    auth_key: AUTH_KEY,
    auth_secret: AUTH_SECRET,
    query: query
  });

  const targetUrl = `${HOST}/stream?${params.toString()}`;
  const upstream = await fetch(targetUrl, {
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache"
    }
  });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache"
    }
  });
}
