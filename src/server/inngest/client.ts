import { channel, realtimeMiddleware, topic } from "@inngest/realtime";
import { Inngest } from "inngest";
import z from "zod";
import { schemas } from "./types";

export const inngest = new Inngest({
  id: "ecomflow-ai",
  schemas,
  middleware: [realtimeMiddleware()],
});

export const aiChannel = channel("ai").addTopic(
  topic("ai").schema(
    z.object({
      data: z.any(),
    })
  )
);
