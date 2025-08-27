import { os } from "@orpc/server";
import * as z from "zod";
import { inngest } from "../inngest";

export const askNolanAi = os
  .input(
    z.object({
      question: z.string(),
      orderId: z.string(),
    })
  )
  .handler(async ({ input }) => {
    await inngest.send({
      name: "order-ai/query",
      data: {
        question: input.question,
        orderId: input.orderId,
      },
    });
  });

export const router = {
  nolanAi: {
    ask: askNolanAi,
  },
};
