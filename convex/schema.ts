import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  images: defineTable({
    prompt: v.string(),
    model: v.string(),
    imageWidth: v.number(),
    imageHeight: v.number(),
    numberOfImages: v.number(),
    key: v.string(),
  })
})
