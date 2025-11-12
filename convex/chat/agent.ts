import { components } from "../_generated/api";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { defaultConfig } from "./config";
import { usageHandler } from "./usage";
import { webSearch } from "@exalabs/ai-sdk";

export const agent = new Agent(components.agent, {
    name: "tabchat",
   // instructions: "Youre",
    ...defaultConfig,
  });

  export function chatBetterAgent(
    model: string,
    webSearchTool: boolean,
  ) {
    return new Agent(components.agent, {
      name: "tabchat",
      languageModel: model,
      usageHandler: async (ctx, args) => {
       // const { usage, model, provider, agentName, threadId, userId } = args;
        await usageHandler(ctx, args);
      },
      textEmbeddingModel: "google/text-multilingual-embedding-002",
      instructions: "You are an tabchat ai assistant that can help with tasks",
      tools: webSearchTool ? {
        webSearch: webSearch(),
      } : undefined,
      stopWhen:[stepCountIs(3)], // stop after 3 steps
    });
  }
