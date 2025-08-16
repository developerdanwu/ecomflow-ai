import { EventSchemas } from "inngest";
import z from "zod";

export const schemas = new EventSchemas().fromZod({
  "order-ai/query": {
    data: z.object({
      question: z.string(),
      orderId: z.string().optional(),
      userId: z.string().optional(),
      sessionId: z.string().optional(),
    }),
  },
});
