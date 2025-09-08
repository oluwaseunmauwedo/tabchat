import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const saveGeneratedImage = mutation({
    args: {
        prompt: v.string(),
        model: v.string(),
        imageWidth: v.number(),
        imageHeight: v.number(),
        numberOfImages: v.number(),
        storageId: v.optional(v.id("_storage")),
        body: v.optional(v.string()),
        originalImageId: v.optional(v.string()),
        status: v.union(v.literal("pending"), v.literal("generated"), v.literal("failed") , v.literal("running"))
    },
    handler: async (ctx, args) => {
        const { prompt, model, imageWidth, imageHeight, numberOfImages, status, storageId, body } = args;

        const generatedImageId = await ctx.db.insert("images", {
            prompt: prompt,
            model: model,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            numberOfImages: numberOfImages,
            storageId: storageId,
            createdAt: Date.now(),
            status: status,
            body: body,
        });
        return generatedImageId;
    },
});


export const updateImageStatus = mutation({
    args : {
        prompt: v.string(),
        model: v.string(),
        imageWidth: v.number(),
        imageHeight: v.number(),
        numberOfImages: v.number(),
        body: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        status: v.union(v.literal("pending"), v.literal("generated"), v.literal("failed") , v.literal("running")) ,
    } , handler : async (ctx, args) => {
        const { prompt, model, imageWidth, status,  imageHeight, numberOfImages, storageId, body } = args;

        const generatedImageId = await ctx.db.insert("images", {
            prompt: prompt,
            model: model,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            numberOfImages: numberOfImages,
            storageId: storageId,
            body: body,
            createdAt: Date.now(),
            status: status,
        });
        return generatedImageId;
    },
})