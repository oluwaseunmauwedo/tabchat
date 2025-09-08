import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  images: defineTable({
    prompt: v.string(),
    model: v.string(),
    body : v.optional(v.string()),
    imageWidth: v.optional(v.number()),
    imageHeight: v.optional(v.number()),
    numberOfImages: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("pending"), v.literal("generated"), v.literal("failed") , v.literal("running")) ,
    createdAt: v.optional(v.number()),
    fileSize: v.optional(v.number()),
    fileName: v.optional(v.string()),
  }),

})
