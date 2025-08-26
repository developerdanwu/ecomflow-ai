"use server";

import { aiChannel, inngest } from "@/server/inngest/client";
import { getSubscriptionToken } from "@inngest/realtime";

export async function fetchSubscriptionToken() {
  const token = await getSubscriptionToken(inngest, {
    channel: aiChannel(),
    topics: ["ai"],
  });

  return token;
}
