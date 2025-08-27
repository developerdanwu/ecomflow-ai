import { GenerateTextResult, StreamTextResult } from "ai";

export interface AgentBase {
  streamText(props: unknown): StreamTextResult<any, any>;
  generateText(props: unknown): Promise<GenerateTextResult<any, any>>;
}
