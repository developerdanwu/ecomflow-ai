import {
  AnswerCorrectness as BaseAnswerCorrectness,
  AnswerRelevancy as BaseAnswerRelevancy,
  Factuality as BaseFactuality,
} from "autoevals";
import { createScorer } from "evalite";
type EvalInput = {
  prompt: string;
  metadata?: {
    context?: string;
  };
};

export const AnswerCorrectness = createScorer<EvalInput, string, string>({
  name: "AnswerCorrectness",
  description: "AnswerCorrectness",
  scorer: async ({ input, expected, output }) => {
    const result = await BaseAnswerCorrectness({
      input: input.prompt,
      expected,
      output,
      context: input.metadata?.context,
    });

    return {
      score: result.score || 0,
      metadata: result.metadata,
    };
  },
});

export const AnswerRelevancy = createScorer<EvalInput, string, string>({
  name: "AnswerRelevancy",
  description: "AnswerRelevancy",
  scorer: async ({ input, expected, output }) => {
    const result = await BaseAnswerRelevancy({
      input: input.prompt,
      expected,
      output,
      context: input.metadata?.context,
    });

    return {
      score: result.score || 0,
      metadata: result.metadata,
    };
  },
});

export const Factuality = createScorer<EvalInput, string, string>({
  name: "Factuality",
  description: "Factuality",
  scorer: async ({ input, expected, output }) => {
    const result = await BaseFactuality({
      input: input.prompt,
      expected,
      output,
    });

    return {
      score: result.score || 0,
      metadata: result.metadata,
    };
  },
});
