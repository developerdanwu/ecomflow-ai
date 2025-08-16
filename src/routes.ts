import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/order-ai/index.tsx"),
  route("/api/inngest", "routes/api/inngest.tsx"),
] satisfies RouteConfig;
