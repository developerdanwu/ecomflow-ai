import { inngest } from "@/server/inngest";
import { functions } from "@/server/inngest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
