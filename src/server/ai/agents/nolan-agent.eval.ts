import { evalite } from "evalite";
import { AnswerCorrectness, Factuality } from "../scorers";
import { nolanAgent } from "./nolan-agent";

evalite("Can help user find order status using order id", {
  data: async () => {
    return [
      {
        input: {
          metadata: {
            context: `
                Status: Delivered
Delivered on: 2025-08-07 18:01:52 (United Kingdom)
Shipping method: Standard Delivery - UK - Royal Mail (5-8 business days)
Tracking number: IT7XXXXXXX6GB (masked)
                `,
          },
          prompt: `
    Please help the user with the following question regarding their order:
    
    \`\`\`
    Question: What is the status of my order?
    Order ID: 297b2cc5e3c97637
    \`\`\`
        `,
        },
        expected: `
         I've looked up your order 297b2cc5e3c97637.

Status: Delivered
Delivered on: 2025-08-07 18:01:52 (United Kingdom)
Shipping method: Standard Delivery - UK - Royal Mail (5-8 business days)
Tracking number: IT7XXXXXXX6GB (masked)
If you didn’t receive the package or have any issues with the delivery, please contact customer service for assistance.
         `,
      },
    ];
  },
  task: async (input) => {
    const result = await nolanAgent.generateText({
      userPrompt: input.prompt,
    });

    return result.text;
  },
  scorers: [AnswerCorrectness, Factuality],
});

evalite("Can help user find order status using customer email", {
  data: async () => {
    return [
      {
        input: {
          metadata: {
            context: `
                Found 1 order for Olivia Thompson with the email olivia.thompson+adf9@example.com:

Order ID (public): 297b2cc5e3c97637
Customer name: Olivia Thompson
Email: olivia.thompson+adf9@example.com
Order status code: 2
Created at: 2025-08-11 18:10:26
Shipped at: 2025-08-11 18:10:51
Delivered at: 2025-08-07 18:01:52
                `,
          },
          prompt: `
    Please help the user with the following question regarding their order:
    
    \`\`\`
    Question: Can you find customer using my email - olivia.thompson+adf9@example.com
    \`\`\`
    `,
        },
        expected: `
         Thanks for the details. I looked up the email you provided.

Found 1 order for Olivia Thompson with the email olivia.thompson+adf9@example.com:

Order ID (public): 297b2cc5e3c97637
Customer name: Olivia Thompson
Email: olivia.thompson+adf9@example.com
Order status code: 2
Created at: 2025-08-11 18:10:26
Shipped at: 2025-08-11 18:10:51
Delivered at: 2025-08-07 18:01:52
         `,
      },
    ];
  },
  task: async (input) => {
    const result = await nolanAgent.generateText({
      userPrompt: input.prompt,
    });

    return result.text;
  },
  scorers: [Factuality, AnswerCorrectness],
});

evalite("Handles order not found scenario gracefully", {
  data: async () => {
    return [
      {
        input: {
          prompt: `
    Please help the user with the following question regarding their order:
    
    \`\`\`
    Question: What is the status of my order?
    Order ID: nonexistent123
    \`\`\`
    `,
        },
        expected: `
         I looked up order nonexistent123 but couldn't find it in our system. Please double-check the order ID and contact customer service if you need further assistance.
         `,
      },
      {
        input: {
          prompt: `
    Please help the user with the following question regarding their order:
    
    \`\`\`
    Question: Can you check the status of order xyz789invalid?
    \`\`\`
    `,
        },
        expected: `
         I looked up order xyz789invalid but couldn't find it in our system. Please double-check the order ID and contact customer service if you need further assistance.
         `,
      },
    ];
  },
  task: async (input) => {
    const result = await nolanAgent.generateText({
      userPrompt: input.prompt,
    });

    return result.text;
  },
  scorers: [Factuality],
});
