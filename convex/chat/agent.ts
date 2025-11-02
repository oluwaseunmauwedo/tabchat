import { components } from "../_generated/api";
import { Agent } from "@convex-dev/agent";
import { defaultConfig } from "./config";

export const agent = new Agent(components.agent, {
    name: "ImageFlow",
    instructions: "Be concise and casual.",
    ...defaultConfig,
  });