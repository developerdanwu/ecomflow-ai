import { db } from "@/server/db/index";
import { orders } from "@/server/db/schema";
import { tool } from "ai";
import { eq, like, or } from "drizzle-orm";
import z from "zod";

export const findOrderById = tool({
  name: "findOrderById",
  description: "Find an order by its ID",
  inputSchema: z.object({
    orderId: z.string(),
  }),
  outputSchema: z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string(),
      order: z.object({
        orderPublicId: z.string(),
        customerName: z.string(),
        customerEmail: z.string(),
      }),
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      order: z.null(),
    }),
  ]),
  execute: async ({ orderId }) => {
    try {
      // Query the orders table using the orderPublicId column
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.orderPublicId, orderId))
        .limit(1);

      if (order.length === 0) {
        return {
          success: false,
          message: `Order with ID ${orderId} not found`,
          order: null,
        };
      }

      return {
        success: true,
        message: `Order ${orderId} found successfully`,
        order: order[0],
      };
    } catch (error) {
      return {
        success: false,
        message: `Error querying order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        order: null,
      };
    }
  },
});

export const findOrdersByCustomer = tool({
  name: "findOrdersByCustomer",
  description: "Find orders by customer email address or customer name",
  inputSchema: z.object({
    search: z.string().min(1, "Search term cannot be empty"),
  }),
  outputSchema: z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string(),
      orders: z.array(
        z.object({
          orderPublicId: z.string(),
          customerName: z.string(),
          customerEmail: z.string(),
          orderStatus: z.number(),
          createdAt: z.string(),
          shippedAt: z.string().nullable(),
          deliveredAt: z.string().nullable(),
        })
      ),
      count: z.number(),
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      orders: z.array(z.never()),
      count: z.literal(0),
    }),
  ]),
  execute: async ({ search }) => {
    try {
      // Query the orders table using both customerEmail and customerName columns
      const foundOrders = await db
        .select({
          orderPublicId: orders.orderPublicId,
          customerName: orders.customerName,
          customerEmail: orders.customerEmail,
          orderStatus: orders.orderStatus,
          createdAt: orders.createdAt,
          shippedAt: orders.shippedAt,
          deliveredAt: orders.deliveredAt,
        })
        .from(orders)
        .where(
          or(
            like(orders.customerEmail, `%${search}%`),
            like(orders.customerName, `%${search}%`)
          )
        );

      if (foundOrders.length === 0) {
        return {
          success: false,
          message: `No orders found for search term "${search}"`,
          orders: [],
          count: 0,
        };
      }

      return {
        success: true,
        message: `Found ${foundOrders.length} order${
          foundOrders.length === 1 ? "" : "s"
        } matching "${search}"`,
        orders: foundOrders,
        count: foundOrders.length,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error querying orders: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        orders: [],
        count: 0,
      };
    }
  },
});
