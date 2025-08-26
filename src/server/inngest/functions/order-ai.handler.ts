import { readUIMessageStream, streamText } from "ai";
import { grok3 } from "../../ai/openai";
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

    // Step 2: Generate AI response
    await step.run("generate-ai-response", async () => {
      const systemPrompt = `
      You are a helpful AI assistant named Nolan for an e-commerce supply chain management platform called Ecomflow. 
      You specifically help customers with their order inquiries, product questions, and any general support questions.

      # Rules
      - If an order ID is provided, acknowledge it and find the order from the database
      - IMPORTANT: DO NOT ATTEMPT TO FABRICATE INFORMATION. If you cannot find the order, you should say that you cannot find the order and suggest the customer to contact customer service instead.
      - For order-specific issues, recommend contacting customer service if you cannot resolve it

      # Response tone
      - Be friendly, professional, and helpful
      - Keep responses concise but informative
      `;

      const userMessage = `
      Please help the user with the following question regarding their order:

      \`\`\`
      Question: ${question}
      ${orderId ? `Order ID: ${orderId}` : ""}
      \`\`\`
      
      `;

      const result = streamText({
        model: grok3,
        system: systemPrompt,
        prompt: userMessage,
        // low temperature to prevent hallucination
        temperature: 0.2,
      });
      const stream = result.toUIMessageStream();

      for await (const message of readUIMessageStream({ stream })) {
        logger.info("message", message);
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
