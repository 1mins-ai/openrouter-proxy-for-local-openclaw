export default {
  async fetch(request, env) {
    const TARGET = "https://openrouter.ai/api";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const url = new URL(request.url);
    const targetURL = TARGET + url.pathname + url.search;

    const newRequest = new Request(targetURL, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    const response = await fetch(newRequest);

    return response;
  },
};
