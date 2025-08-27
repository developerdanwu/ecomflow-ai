import { InferUITool, UIDataTypes, UIMessage } from "ai";
import { findOrderById, findOrdersByCustomer } from "./tools";

export type EcomflowUIMessage = UIMessage<
  {},
  UIDataTypes,
  {
    findOrderById: InferUITool<typeof findOrderById>;
    findOrdersByCustomer: InferUITool<typeof findOrdersByCustomer>;
  }
>;
