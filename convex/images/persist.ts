import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const saveGeneratedImage = mutation({
    args: {
        prompt: v.string(),
        model: v.string(),
        imageWidth: v.number(),
        imageHeight: v.number(),
        numberOfImages: v.number(),
        storageId: v.id("_storage"),
        url : v.string(),
        jobId: v.optional(v.id("jobs")),
        status: v.union(v.literal("pending"), v.literal("generated"), v.literal("failed") , v.literal("running"))
    },
    handler: async (ctx, args) => {
        const { prompt, model, imageWidth, imageHeight, numberOfImages, status, storageId, url, jobId } = args;

        const generatedImageId = await ctx.db.insert("images", {
            prompt: prompt,
            model: model,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            numberOfImages: numberOfImages,
            storageId: storageId,
            url: url,
            createdAt: Date.now(),
            jobId: jobId,
            creationTime: Date.now(),
            status: status,
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
        storageId: v.optional(v.id("_storage")),
        url : v.optional(v.string()),
        jobId: v.optional(v.id("jobs")),
        status: v.union(v.literal("pending"), v.literal("generated"), v.literal("failed") , v.literal("running")) ,
    } , handler : async (ctx, args) => {
        const { prompt, model, imageWidth, status,  imageHeight, numberOfImages, storageId, url, jobId } = args;

        const generatedImageId = await ctx.db.insert("images", {
            prompt: prompt,
            model: model,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            numberOfImages: numberOfImages,
            storageId: storageId,
            url: url,
            createdAt: Date.now(),
            jobId: jobId,
            creationTime: Date.now(),
            status: status,
        });
        return generatedImageId;
    },
})