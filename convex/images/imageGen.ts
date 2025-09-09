import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { experimental_generateImage as generateImage } from "ai";
import { Effect } from "effect";
import { openai } from "@ai-sdk/openai"
import { api } from "../_generated/api";


export const generateImages = internalAction({
  args: {
    prompt: v.string(),
    imageWidth: v.optional(v.number()),
    imageHeight: v.optional(v.number()),
    numberOfImages: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
    originalImageId: v.optional(v.id("images")),
  },
  handler : async( ctx, args) =>  {
    const program = Effect.gen(function* (_) {
      const { prompt, imageHeight, imageWidth, numberOfImages, storageId, originalImageId } = args
      
      const { images } = yield* _(
        Effect.tryPromise({
          try: () =>
            generateImage({
              model: openai.image('dall-e-3'),
              prompt: prompt,
              size: '1024x1024',
            }),
          catch: () => new Error("Error While generating image")
        })
      )

      const storedImages = [];

      for (const image of images) {
        const storageId = yield* _(
          Effect.tryPromise({
            try: () => {
              const copiedBytes = new Uint8Array(image.uint8Array);
              return ctx.storage.store(new Blob([copiedBytes], { type: image.mediaType }));
            },
            catch: () => new Error("Error while storing the images")
          })
        )

        const url = yield* _(
          Effect.tryPromise({
            try: () => ctx.storage.getUrl(storageId),
            catch: (error) => new Error(`Failed to get image URL: ${error}`),
          })
        );

        yield* _(
          Effect.tryPromise({
            try: async (): Promise<void> => {
              await ctx.runMutation(api.images.persist.saveGeneratedImage, {
                body: storageId,
                originalImageId: originalImageId,
                prompt,
                model: "gemini-2.5-flash-image-preview",
                imageWidth: imageWidth ?? 1024,
                imageHeight: imageHeight ?? 1024,
                numberOfImages: 1,
                status: "generated",
                storageId: args.storageId,
              });
            },
            catch : () => new Error("Error while persit the data")
          })
        )
        storedImages.push({
          storageId,
          mediaType: image.mediaType,
          url,
        });
      }
     return storageId
    }).pipe(
      Effect.tapError((err) => Effect.sync(() => console.error("Error in generateImages:", err)))
    );
    try {
      return await Effect.runPromise(program);
    } catch (error) {
      console.error("Failed to execute generateImages program:", error);
      throw error;
    }
     
  },
});
