import { gpt5Nano } from "@/server/ai/openai";
import { findOrderById, findOrdersByCustomer } from "@/server/ai/tools";
import { readUIMessageStream, stepCountIs, streamText } from "ai";
import { aiChannel, inngest } from "../client";

// Event type for order AI requests
export const orderAIEvent = "order-ai/query";

// Inngest function to handle order AI queries with streaming
export const handleOrderAIQuery = inngest.createFunction(
  { id: "handle-order-ai-query" },
  { event: "order-ai/query" },
  async ({ event, step, publish, logger }) => {
    logger.info("message");
    const { question, orderId } = event.data;

    const result = await step.run("call LLM", async () => {
      const systemPrompt = `
      You are a helpful AI assistant named Nolan for an e-commerce supply chain management platform called Ecomflow. 
      You specifically help customers with their order inquiries, product questions, and any general support questions.

      # Rules
      - If an order ID is provided, ALWAYS use the findOrderById tool to look up the order details from the database
      - IMPORTANT: DO NOT ATTEMPT TO FABRICATE INFORMATION. Only provide information that comes from the database query results
      - If the tool returns that an order is not found, inform the customer and suggest they contact customer service
      - If the tool returns order information, provide helpful details about their order status, shipping, etc.
      - For order-specific issues, recommend contacting customer service if you cannot resolve it
      - ALWAYS end your response with a text response. DO NOT complete after using a tool.

      # Available Tools
      - findOrderById: Use this tool whenever an order ID is mentioned to get real order data from the database
      - findOrdersByCustomer: Use this tool to search for orders by customer email or customer name

      # Response tone
      - Be friendly, professional, and helpful
      - Keep responses concise but informative
      - Always acknowledge when you've looked up their order
      `;

      const userMessage = `
      Please help the user with the following question regarding their order:

      \`\`\`
      Question: ${question}
      ${orderId ? `Order ID: ${orderId}` : ""}
      \`\`\`
      
      `;

      const result = streamText({
        model: gpt5Nano,
        system: systemPrompt,
        stopWhen: [stepCountIs(10)],
        prompt: userMessage,
        tools: {
          findOrderById,
          findOrdersByCustomer,
        },
        // low temperature to prevent hallucination
        temperature: 0.2,
      });
      const stream = result.toUIMessageStream();

      for await (const message of readUIMessageStream({ stream })) {
        await publish(
          aiChannel().ai({
            data: message,
          })
        );
        console.log(message);
      }
    });

    return {
      success: false,
      result: result,
    };
  }
);

// Helper function to trigger the Inngest function
export async function triggerOrderAIQuery(data: {
  question: string;
  orderId?: string;
  userId?: string;
  sessionId?: string;
}) {
  try {
    await inngest.send({
      name: orderAIEvent,
      data: {
        question: data.question,
        orderId: data.orderId,
        userId: data.userId || "anonymous",
        sessionId: data.sessionId || `session_${Date.now()}`,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error triggering order AI query:", error);
    return { success: false, error: "Failed to trigger AI query processing" };
  }
}
