import { type Config } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

export const defaultConfig = {
  languageModel: openai("gpt-4o-mini"),
} satisfies Config;