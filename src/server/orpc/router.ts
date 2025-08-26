import { os } from "@orpc/server";
import * as z from "zod";
import { inngest } from "../inngest";

const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
});

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
    // your list code here
    return [{ id: 1, name: "name" }];
  });

export const findPlanet = os
  .input(PlanetSchema.pick({ id: true }))
  .handler(async ({ input }) => {
    // your find code here
    return { id: 1, name: "name" };
  });

export const router = {
  nolanAi: {
    ask: askNolanAi,
  },
};
