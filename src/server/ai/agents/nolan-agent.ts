import { AgentBase } from "@/server/ai/agents/types";
import { gpt5Nano } from "@/server/ai/openai";
import { findOrderById, findOrdersByCustomer } from "@/server/ai/tools";
import {
  generateText as generateTextAi,
  stepCountIs,
  streamText as streamTextAi,
} from "ai";

class NolanAgent implements AgentBase {
  private agentConfig = {
    model: gpt5Nano,
    system: this.getSystemPrompt(),
    stopWhen: [stepCountIs(10)],
    // low temperature to prevent hallucination
    temperature: 0.2,
    tools: {
      findOrderById,
      findOrdersByCustomer,
    },
  };

  public streamText({ userPrompt }: { userPrompt: string }) {
    const result = streamTextAi({
      ...this.agentConfig,
      prompt: userPrompt,
    });

    return result;
  }

  public async generateText({ userPrompt }: { userPrompt: string }) {
    const result = await generateTextAi({
      ...this.agentConfig,
      prompt: userPrompt,
    });

    return result;
  }

  private getSystemPrompt() {
    return `
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
  }
}

export const nolanAgent = new NolanAgent();
