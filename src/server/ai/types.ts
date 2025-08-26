import { InferUITool, UIDataTypes, UIMessage } from "ai";
import { findOrderByEmail, findOrderById } from "./tools";

export type EcomflowUIMessage = UIMessage<
  {},
  UIDataTypes,
  {
    findOrderById: InferUITool<typeof findOrderById>;
    findOrderByEmail: InferUITool<typeof findOrderByEmail>;
  }
>;
