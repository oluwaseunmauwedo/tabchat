import { R2 } from "@convex-dev/r2";
import { components } from "./_generated/api";
import { query } from "./_generated/server";

export const r2 = new R2(components.r2);

export const { generateUploadUrl, syncMetadata } = r2.clientApi();


export const getImages = query({
    handler: async (ctx) => {
      const images = await ctx.db.query("images").order("desc").collect();
  
      // Generate URLs for each image
      return images.map((image) => ({
        ...image,
        url: image.url,
      }));
    },
  });