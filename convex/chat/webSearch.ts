import { z } from 'zod';
import Exa from 'exa-js';
import { createTool } from '@convex-dev/agent';

export const exa = new Exa(process.env.EXA_API_KEY);

export const webSearchTool = createTool({
  description: 'Perform a real-time online search to retrieve the latest information and key content from top web sources. Use this tool to find current facts, recent events, or authoritative data not present in your existing knowledge base.',
  args: z.object({
    query: z.string().min(1).max(100).describe('The search query'),
  }),
  handler: async (ctx, args) => {

    const { query } = args;
    const { results } = await exa.searchAndContents(query, {
      livecrawl: 'always',
      numResults: 3,
    });
    return results.map(result => ({
        title: result.title,
        url: result.url,
        content: result, // take just the first 1000 characters
        publishedDate: result.publishedDate,
      }));
  },
});
