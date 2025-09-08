import { v } from "convex/values";
import { action, internalAction, mutation } from "../_generated/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { api, internal } from "../_generated/api";




function base64ToUint8Array(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export const generateImages = internalAction({
    args: {
        prompt: v.string(),
        imageWidth: v.optional(v.number()),
        imageHeight: v.optional(v.number()),
        storageId: v.optional(v.id("_storage")),
        originalImageId: v.optional(v.id("images")),
    }, handler: async (ctx, args) => {
        try {
            const { prompt, imageWidth, imageHeight, storageId, originalImageId } = args;


            const result = await generateText({
                model: google("gemini-2.5-flash-image-preview"),
                providerOptions: {
                    google: { responseModalities: ['TEXT', 'IMAGE'], },
                },
                prompt: prompt,
            });

            // Look for image files and store them
            const storedImages = [];

            for (const file of result.files) {
                console.log('Processing file with media type:', file.mediaType);
                if (file.mediaType && file.mediaType.startsWith('image/')) {
                    try {
                        // Convert base64 string to binary data
                        const base64Data = file.base64.includes(',')
                            ? file.base64.split(',')[1]
                            : file.base64;

                        //Convert base64 to Uint8Array
                        const bytes = base64ToUint8Array(base64Data);

                        // Create Blob from binary data
                        const blob = new Blob([bytes], { type: file.mediaType });

                        // Store in Convex storage
                        const storageId = await ctx.storage.store(blob);
                        const url = await ctx.storage.getUrl(storageId);
                        console.log(url);


                        await ctx.runMutation(api.images.persist.saveGeneratedImage, {
                            body : storageId,
                            originalImageId: originalImageId as string,
                            prompt: prompt,
                            model: "gemini-2.5-flash-image-preview",
                            imageWidth: imageWidth ?? 1024,
                            imageHeight: imageHeight ?? 1024,
                            numberOfImages: 1,
                            status: "generated",
                          });
                    
                          storedImages.push({
                            storageId,
                            mediaType: file.mediaType,
                            size: bytes.length
                        });

                        return base64Data
                    } catch (error) {
                        console.error('Error storing image:', error);
                    }
                }
            }

        } catch (error) {
            console.error("Error in generate action:", error);
            throw error;
        }
    },
})


export const scheduleImageGeneration = mutation({
    args: {
        prompt: v.string(),
        imageWidth: v.optional(v.number()),
        imageHeight: v.optional(v.number()),
        model: v.optional(v.string()),
        numberOfImages: v.optional(v.number()),
        body: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        originalImageId: v.optional(v.id("images")),
    },
    handler: async (ctx, args) => {

        const { prompt, imageWidth, imageHeight, numberOfImages, body, storageId, model } = args;

      const originalImageId = await ctx.db.insert("images", {
            prompt: prompt,
            body: storageId,
            imageWidth: imageWidth ?? 1024,
            imageHeight: imageHeight ?? 1024,
            numberOfImages: numberOfImages ?? 1,
            createdAt: Date.now(),
            status: "running",
            model: model ?? "gemini-2.5-flash-image-preview",
        });

        await ctx.scheduler.runAfter(0, internal.images.generate.generateImages, {
            prompt: prompt,
        });

        return originalImageId;
    }
     
})

