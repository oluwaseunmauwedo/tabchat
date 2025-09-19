import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendImages = mutation({
  args: {
    storageId: v.id("_storage"),
    originalImageId: v.optional(v.string()),
    isGenerated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("images", {
      body: args.storageId,
      createdAt: Date.now(),
      isGenerated: args.isGenerated,
      originalImageId: args.originalImageId,
      model: "",
      prompt: "",
    });
  },
});

export const getImages = query({
  handler: async (ctx) => {
    const images = await ctx.db.query("images").order("desc").collect();

    // Generate URLs for each image
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const url = image.body ? await ctx.storage.getUrl(image.body!) : null;
        return { ...image, url };
      }),
    );

    return imagesWithUrls;
  },
});
