import { functions, inngest } from "@/server/inngest";
import { serve } from "inngest/remix";
import type { Route } from "./+types/inngest";

const handler = serve({ client: inngest, functions });

export function loader(args: Route.LoaderArgs) {
  return handler(args);
}

export function action(args: Route.ActionArgs) {
  return handler(args);
}
