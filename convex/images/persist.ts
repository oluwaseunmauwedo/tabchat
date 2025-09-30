import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { Effect } from "effect"

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
    status: v.union(
      v.literal("pending"),
      v.literal("generated"),
      v.literal("failed"),
      v.literal("running"),
    ),
    userId: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const {
      prompt,
      model,
      imageWidth,
      imageHeight,
      numberOfImages,
      status,
      storageId,
      body,
      userId,
      url,
    } = args;

    const program = Effect.gen(function* (_) {
      const generatedImage = yield* _(
        Effect.tryPromise({
          try: async () => {
            await ctx.db.insert("images", {
              prompt: prompt,
              model: model,
              imageWidth: imageWidth,
              imageHeight: imageHeight,
              numberOfImages: numberOfImages,
              storageId: storageId,
              createdAt: Date.now(),
              status: status,
              body: body,
              userId: userId,
              url: url,
            })
          },
          catch: () => new Error("Error while saving the generated Images")
        })
      )
      return generatedImage
    }).pipe(
      Effect.tapError((err) => Effect.sync(() => console.error("Error in saveGeneratedImage:", err)))
    )
    try {
      return await Effect.runPromise(program)
    } catch {
      throw new Error("Unknow error occured")
    }
  }
});

export const updateImageStatus = mutation({
  args: {
    imageId: v.optional(v.id("images")),
    status: v.union(
      v.literal("pending"),
      v.literal("generated"),
      v.literal("failed"),
      v.literal("running"),
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { imageId, status, error = "" } = args;

    const updateData = { status, error};

    await ctx.db.patch(imageId!, updateData);
  },
});
