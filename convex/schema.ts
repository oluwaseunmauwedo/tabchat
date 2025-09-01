import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  images: defineTable({
    prompt: v.string(),
    creationTime : v.number(),
    model: v.string(),
    imageWidth: v.optional(v.number()),
    imageHeight: v.optional(v.number()),
    numberOfImages: v.optional(v.number()),
    storageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("pending"), v.literal("generated"), v.literal("failed") , v.literal("running")) ,
    createdAt: v.optional(v.number()),
    url: v.optional(v.string()),
    jobId: v.optional(v.id("jobs")),
    fileSize: v.optional(v.number()),
    fileName: v.optional(v.string()),
  }),

   jobs : defineTable({
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed") , v.literal("running")),
    createdAt: v.number(),
    updatedAt: v.number(),
    images: v.array(v.id("images")),
    prmopt : v.string()
   })


})
