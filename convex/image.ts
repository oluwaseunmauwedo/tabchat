import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const getImages = query({
    handler: async (ctx) => {
      const images = await ctx.db.query("images").order("desc").collect();
  
      // Generate URLs for each image
      const imagesWithUrls = await Promise.all(
        images.map(async (image) => {
          const url = image.body
            ? await ctx.storage.getUrl(image.body!)
            : null;
          return { ...image, url };
        })
      );
  
      return imagesWithUrls;
    },
  });