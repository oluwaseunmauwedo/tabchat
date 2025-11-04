import { components } from "../_generated/api";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { defaultConfig } from "./config";
import { webSearchTool } from "./webSearch";

export const agent = new Agent(components.agent, {
    name: "tabchat",
    instructions: "You are an AI assistant that can help with tasks",
    ...defaultConfig,
  });

  export function chatBetterAgent(
    model: string,
    webSearch: boolean,
  ) {
    return new Agent(components.agent, {
      name: "tabchat",
      languageModel: model,
      instructions: "You are an tabchat ai assistant that can help with tasks",
      tools: webSearch ? {
        webSearch: webSearchTool,
      } : undefined,
      stopWhen: [stepCountIs(3)], // stop after 3 steps
    });
  }