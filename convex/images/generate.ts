import { v } from "convex/values";
import { internalAction, mutation } from "../_generated/server";
import { experimental_generateImage as generateImage } from "ai";
import { api, internal } from "../_generated/api";
import { Effect } from "effect";
import { fal } from "@ai-sdk/fal";

export const generateImages = internalAction({
  args: {
    prompt: v.string(),
    imageWidth: v.optional(v.number()),
    imageHeight: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
    originalImageId: v.optional(v.id("images")),
    userId: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const program = Effect.gen(function* (_) {
      const { prompt, imageWidth, imageHeight, originalImageId, userId, url } = args;

      const result = yield* _(
        Effect.tryPromise({
          try: () =>
            generateImage({
              model: fal.image("fal-ai/gemini-25-flash-image/edit"),
              prompt: prompt,
              // size: size,
              // n: numberOfImages,
              providerOptions : {
                fal : {
                  image_url: url ?? "",
                }
              },

            }),
          catch: (error) => new Error(`Failed to generate Image: ${error}`),
        }),
      );

      const storedImages = [];

      // Process each file
      for (const image of result.images) {
        const storageId = yield* _(
          Effect.tryPromise({
            try: () => {
              const copiedBytes = new Uint8Array(image.uint8Array);
              return ctx.storage.store(
                new Blob([copiedBytes], { type: image.mediaType }),
              );
            },
            catch: () => new Error("Error while storing the images"),
          }),
          );

          const url = yield* _(
            Effect.tryPromise({
              try: () => ctx.storage.getUrl(storageId),
              catch: (error) => new Error(`Failed to get image URL: ${error}`),
            }),
          );

          yield* _(
            Effect.tryPromise({
              try: async (): Promise<void> => {
                await ctx.runMutation(api.images.persist.saveGeneratedImage, {
                  body: storageId,
                  originalImageId: originalImageId,
                  prompt,
                  model: "fal-ai/gemini-25-flash-image/edit",
                  imageWidth: imageWidth ?? 1024,
                  imageHeight: imageHeight ?? 1024,
                  numberOfImages: 1,
                  status: "generated",
                  storageId: args.storageId,
                  userId: userId,
                  url: url!,
                });
              },
              catch: (error) => new Error(`Failed to save image: ${error}`),
            }),
          );

          storedImages.push({
            storageId,
            mediaType: image.mediaType,
            size: image.uint8Array.length,
            url,
          });

      }

      //return storedImages;
    }).pipe(
      Effect.tapError((err) =>
        Effect.sync(() => console.error("Error in generateImages:", err)),
      ),
    );

    // Fix: Properly handle the Effect execution
    try {
      return await Effect.runPromise(program);
    } catch (error) {
      await ctx.runMutation(api.images.persist.updateImageStatus , {
        imageId : args.originalImageId!,
        status : "failed",
        error : `Error while generating Images ${error}`
      })
      console.error("Failed to execute generateImages program:", error);
      throw error;
    }
  },
});

export const scheduleImageGeneration = mutation({
  args: {
    prompt: v.string(),
    imageWidth: v.number(),
    imageHeight: v.number(),
    model: v.string(),
    numberOfImages: v.number(),
    storageId: v.optional(v.id("_storage")),
    originalImageId: v.optional(v.id("images")),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const {
      prompt,
      imageWidth,
      imageHeight,
      numberOfImages,
      storageId,
      model,
      url,
    } = args;

    const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			return {
				message: "Not authenticated",
			};
		}

    const originalImageId = await ctx.db.insert("images", {
      prompt: prompt,
      body: storageId,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      numberOfImages: numberOfImages,
      createdAt: Date.now(),
      status: "running",
      model: model!,
      userId: identity.subject,
      url: url,
    });

    await ctx.scheduler.runAfter(0, internal.images.imageGen.generateImages, {
      prompt: prompt,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      numberOfImages: numberOfImages,
      model : model!,
      userId: identity.subject,
      url: url,
    });

    return originalImageId;
  },
});
