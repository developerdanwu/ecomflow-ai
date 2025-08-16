import { xai } from "@ai-sdk/xai";
import { generateObject, generateText, streamText } from "ai";

// const gpt4oMini = openai("gpt-4o-mini");
const grok3 = xai("grok-3");
// Generate text response for order-related queries
export async function generateOrderResponse(
  question: string,
  orderId?: string
) {
  const systemPrompt = `You are a helpful AI assistant for an e-commerce platform. 
  You help customers with their order inquiries, product questions, and general support.
  
  Guidelines:
  - Be friendly, professional, and helpful
  - If an order ID is provided, acknowledge it and offer specific order assistance
  - If no order ID is provided, offer general help and suggest they provide one if needed
  - For order-specific issues, recommend contacting customer service if you cannot resolve it
  - Keep responses concise but informative`;

  const userMessage = orderId
    ? `Order ID: ${orderId}\nQuestion: ${question}`
    : `Question: ${question}`;

  try {
    const { text } = await generateText({
      model: grok3,
      system: systemPrompt,
      prompt: userMessage,
      temperature: 0.7,
      maxTokens: 500,
    });

    return { success: true, response: text };
  } catch (error) {
    console.error("Error generating order response:", error);
    return {
      success: false,
      error: "Failed to generate response. Please try again later.",
    };
  }
}

// Stream text response for real-time experience
export async function streamOrderResponse(question: string, orderId?: string) {
  const systemPrompt = `You are a helpful AI assistant for an e-commerce platform. 
  You help customers with their order inquiries, product questions, and general support.
  
  Guidelines:
  - Be friendly, professional, and helpful
  - If an order ID is provided, acknowledge it and offer specific order assistance
  - If no order ID is provided, offer general help and suggest they provide one if needed
  - For order-specific issues, recommend contacting customer service if you cannot resolve it
  - Keep responses concise but informative`;

  const userMessage = orderId
    ? `Order ID: ${orderId}\nQuestion: ${question}`
    : `Question: ${question}`;

  try {
    const result = await streamText({
      model: gpt4oMini,
      system: systemPrompt,
      prompt: userMessage,
      temperature: 0.7,
    });

    return { success: true, stream: result.textStream };
  } catch (error) {
    console.error("Error streaming order response:", error);
    return {
      success: false,
      error: "Failed to generate response. Please try again later.",
    };
  }
}

// Generate structured order analysis
export async function analyzeOrderQuery(question: string, orderId?: string) {
  const systemPrompt = `Analyze the customer's question and categorize it for proper routing.`;

  try {
    const { object } = await generateObject({
      model,
      schema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: [
              "order_status",
              "shipping",
              "returns",
              "product_info",
              "billing",
              "general",
            ],
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high", "urgent"],
          },
          requiresHumanAgent: {
            type: "boolean",
          },
          suggestedActions: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["category", "priority", "requiresHumanAgent"],
      },
      system: systemPrompt,
      prompt: `Question: ${question}${orderId ? `\nOrder ID: ${orderId}` : ""}`,
    });

    return { success: true, analysis: object };
  } catch (error) {
    console.error("Error analyzing order query:", error);
    return {
      success: false,
      error: "Failed to analyze query",
    };
  }
}

export { model };
