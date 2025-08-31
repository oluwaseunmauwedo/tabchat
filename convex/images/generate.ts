import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { v } from "convex/values";
import { action } from "../_generated/server";
import { r2 } from '../image';



export const generate = action({
    args: {
        prompt: v.string(),
        model: v.string(),
        imageWidth: v.number(),
        imageHeight: v.number(),
        numberOfImages: v.number(),
    },
    handler: async (ctx, args) => {
        const { prompt, model, imageWidth, imageHeight, numberOfImages } = args;
        const { images } = await generateImage({
            model: openai.image('dall-e-3'),
            prompt: prompt,
            size: `${imageWidth}x${imageHeight}`,
            providerOptions: {
                openai: { style: 'vivid', quality: 'hd' },
            },
            n: numberOfImages,
        });
        //console.log(images);

        // Generate a unique key for the image
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const imageKey = `generated-images/${timestamp}-${randomId}.jpg`;
       for (const image of images) {
        const key = await r2.store(ctx, image.uint8Array, {
                key: imageKey,
                type: "image/jpeg",
              });
              console.log(key);
        }
        return images.map(image => image.base64);
    },
});
