import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const saveGeneratedImage = mutation({
    args: {
        prompt: v.string(),
        model: v.string(),
        imageWidth: v.number(),
        imageHeight: v.number(),
        numberOfImages: v.number(),
    },
    handler: async (ctx, args) => {
        const { prompt, model, imageWidth, imageHeight, numberOfImages } = args;

        const generatedImageId = await ctx.db.insert("images", {
            prompt: prompt,
            model: model,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            numberOfImages: numberOfImages,
            createdAt: Date.now(),
            isGenerated: true,
        });
        return generatedImageId;
    },
});