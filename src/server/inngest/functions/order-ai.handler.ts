import { nolanAgent } from "@/server/ai/agents/nolan-agent";
import { readUIMessageStream } from "ai";
import { aiChannel, inngest } from "../client";

// Event type for order AI requests
export const orderAIEvent = "order-ai/query";

// Inngest function to handle order AI queries with streaming
export const handleOrderAIQuery = inngest.createFunction(
  { id: "handle-order-ai-query" },
  { event: "order-ai/query" },
  async ({ event, step, publish }) => {
    const { question, orderId } = event.data;
    function getUserMessage({
      question,
      orderId,
    }: {
      question: string;
      orderId?: string;
    }) {
      return `
    Please help the user with the following question regarding their order:
    
    \`\`\`
    Question: ${question}
    ${orderId ? `Order ID: ${orderId}` : ""}
    \`\`\`
    
    `;
    }
    const result = await step.run("call LLM", async () => {
      const result = nolanAgent.streamText({
        userPrompt: getUserMessage({ question, orderId }),
      });

      const stream = result.toUIMessageStream();

      for await (const message of readUIMessageStream({ stream })) {
        await publish(
          aiChannel().ai({
            data: message,
          })
        );
      }
    });

    return {
      result,
    };
  }
);
