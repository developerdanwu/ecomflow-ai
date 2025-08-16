import {
  analyzeOrderQuery,
  generateOrderResponse,
  streamOrderResponse,
} from "../ai/openai";
import { inngest } from "./client";

// Event type for order AI requests
export const orderAIEvent = "order-ai/query";

// Inngest function to handle order AI queries with streaming
export const handleOrderAIQuery = inngest.createFunction(
  { id: "handle-order-ai-query" },
  { event: "order-ai/query" },
  async ({ event, step }) => {
    const { question, orderId, userId, sessionId } = event.data;

    // Step 1: Analyze the query
    const analysis = await step.run("analyze-query", async () => {
      const result = await analyzeOrderQuery(question, orderId);
      return result;
    });

    // Step 2: Generate AI response
    const aiResponse = await step.run("generate-ai-response", async () => {
      // For now, we'll use the non-streaming version in Inngest
      // The streaming will be handled separately in the API route
      const result = await generateOrderResponse(question, orderId);
      return result;
    });

    // Step 3: Log the interaction (you could save to database here)
    await step.run("log-interaction", async () => {
      console.log("Order AI Interaction:", {
        userId,
        sessionId,
        question,
        orderId,
        analysis: analysis.success ? analysis.analysis : null,
        response: aiResponse.success ? aiResponse.response : aiResponse.error,
        timestamp: new Date().toISOString(),
      });

      // Here you could save to a database:
      // await db.orderAIInteractions.create({
      //   userId,
      //   sessionId,
      //   question,
      //   orderId,
      //   analysis: analysis.success ? analysis.analysis : null,
      //   response: aiResponse.success ? aiResponse.response : aiResponse.error,
      //   createdAt: new Date(),
      // });

      return { logged: true };
    });

    // Step 4: Send notification if high priority or requires human agent
    if (
      analysis.success &&
      (analysis.analysis.priority === "urgent" ||
        analysis.analysis.requiresHumanAgent)
    ) {
      await step.run("notify-support-team", async () => {
        console.log("High priority query detected, notifying support team:", {
          userId,
          question,
          orderId,
          priority: analysis.analysis.priority,
          requiresHumanAgent: analysis.analysis.requiresHumanAgent,
        });

        // Here you could send notifications:
        // - Email to support team
        // - Slack notification
        // - Create support ticket
        // await notificationService.sendToSupport({ ... });

        return { notified: true };
      });
    }

    return {
      success: true,
      analysis: analysis.success ? analysis.analysis : null,
      response: aiResponse.success ? aiResponse.response : aiResponse.error,
      requiresFollowUp: analysis.success
        ? analysis.analysis.requiresHumanAgent
        : false,
    };
  }
);

// Function to handle streaming responses (to be called from API routes)
export async function streamOrderAIResponse(
  question: string,
  orderId?: string
) {
  try {
    const result = await streamOrderResponse(question, orderId);
    return result;
  } catch (error) {
    console.error("Error in streaming order AI response:", error);
    return {
      success: false,
      error: "Failed to generate streaming response",
    };
  }
}

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
