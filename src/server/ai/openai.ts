import { openai } from "@ai-sdk/openai";

// gpt-5 cannot stream
export const gpt5 = openai("gpt-5");
// gpt-5-mini cannot stream
export const gpt5Mini = openai("gpt-5-mini");

export const gpt5Nano = openai("gpt-5-nano");
export const gpt4oMini = openai("gpt-4o-mini");
