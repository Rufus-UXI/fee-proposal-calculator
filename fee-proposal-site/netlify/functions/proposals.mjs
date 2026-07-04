import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("fee-calculator");

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method === "GET") {
    const data = await store.get("proposals", { type: "json" }).catch(() => null);
    return new Response(JSON.stringify(data || []), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  if (req.method === "POST") {
    const proposal = await req.json();
    const existing = (await store.get("proposals", { type: "json" }).catch(() => null)) || [];
    const next = [{ ...proposal, id: Date.now().toString(36) }, ...existing];
    await store.setJSON("proposals", next);
    return new Response(JSON.stringify(next), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  return new Response("Method not allowed", { status: 405, headers: cors });
};

export const config = { path: "/api/proposals" };
