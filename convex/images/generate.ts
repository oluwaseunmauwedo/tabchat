import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { v } from "convex/values";
import { internalMutation, action } from "../_generated/server";
import { api } from '../_generated/api';

export interface ImageGenerationResult {
    assets: {
        imageUrl: string
        imageSize: {
            width: number
            height: number
        }
        mimeType: string
    }[]
    prompt: string
    modelId: string
}

export const createImageJob = action({
    args: {
        prompt: v.string(),
        model: v.string(),
        imageWidth: v.number(),
        imageHeight: v.number(),
        numberOfImages: v.number(),
        jobId: v.id("jobs")
    },
    handler: async (ctx, args) => {
        const { prompt, model, imageWidth, imageHeight, numberOfImages } = args;
        const size = `${imageWidth}x${imageHeight}` as `${number}x${number}`;
        try {
            const { images } = await generateImage({
                model: openai.image('dall-e-3'),
                prompt: prompt,
                size: size,
                providerOptions: {
                    openai: { style: 'vivid', quality: 'hd' },
                },
                n: numberOfImages,
            });

            const assets: ImageGenerationResult['assets'] = [];
            for (const image of images) {
                const imageBlob = new Blob([image.uint8Array as BlobPart], { type: "image/png" });
                const generatedStorageId = await ctx.storage.store(imageBlob);
                const url = await ctx.storage.getUrl(generatedStorageId);
                console.log(url);
                assets.push({
                    imageUrl: url!,
                    imageSize: {
                        width: imageWidth,
                        height: imageHeight,
                    },
                    mimeType: "image/png",
                })
                await ctx.runMutation(api.images.persist.saveGeneratedImage, {
                    storageId: generatedStorageId,
                    prompt: prompt,
                    model: model,
                    imageWidth: imageWidth,
                    imageHeight: imageHeight,
                    numberOfImages: numberOfImages,
                    url: url!,
                    jobId: args.jobId,
                    status: "generated",
                });
            }
        } catch (error) {
            console.error("Error generating image:", error);
            await ctx.runMutation(api.images.persist.updateImageStatus, {
                status: "failed",
                prompt: prompt,
                imageWidth: imageWidth,
                imageHeight: imageHeight,
                numberOfImages: numberOfImages,
                model: model,
                jobId: args.jobId,

            });
        }
    },
});



export const createJob = internalMutation({
    args: {
        prompt: v.string(),
        generationRequest: v.array(
            v.object({
                model: v.string(),
                count: v.number()
            })
        )
    },
    handler: async (ctx, args) => {
        const jobs = await ctx.db.insert("jobs", {
            images: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: "running",
            prmopt: args.prompt
        });

        const images = await Promise.all(
            args.generationRequest.map(async (request) => {
                const id = await ctx.db.insert("images", {
                    prompt: args.prompt,
                    creationTime: Date.now(),
                    jobId: jobs,
                    status: "pending",
                    model: request.model,
                })
                return { ...request, id };
            })
        )



        return { jobToPrecess: [images], jobId: jobs };

    },
});

export const updateJobStatus = internalMutation({
    args: {
        jobId: v.id("jobs"),
        status: v.union(v.literal("pending"), v.literal("failed"), v.literal("running"), v.literal("completed"))
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.jobId, { status: args.status , updatedAt : Date.now() });
    },
});

