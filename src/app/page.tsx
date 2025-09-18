"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import Image from "next/image"
import ImagePopup from "@/components/image-open"

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("")
  const [selectedImage, setSelectedImage] = useState<{ url: string; prompt: string } | null>(null)

  const generateImage = useMutation(api.images.generate.scheduleImageGeneration)
  const images = useQuery(api.image.getImages)

  const presets = [
    "A highly detailed metallic humanoid head, smooth brushed steel...",
    "Futuristic neon city at dusk, rain reflections, cyberpunk",
    "Studio portrait, Rembrandt lighting, 85mm lens",
    "Macro shot of dew drops on a leaf, high detail",
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage({ prompt, imageWidth: 1024, imageHeight: 1024, numberOfImages: 1 })
    setPrompt("")
  }

  return (
    <div className="min-h-screen relative overflow-y-auto text-white">
      {/* Sleek dark-to-purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a12] via-[#2c1232] to-[#9D4C71] opacity-95" />

      <div className="relative max-w-6xl mx-auto px-6 py-14 z-10">
        {/* Hero Section */}
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-pink-300 via-white to-pink-200 bg-clip-text text-transparent">
              Create Your Vision
            </span>
          </h2>
          <p className="mt-4 text-lg md:text-xl text-pink-100/80 max-w-2xl mx-auto">
            Describe your dream, and we’ll <span className="font-semibold">bring it to life</span>.
          </p>
        </div>

        {/* Simple flat message box */}
        <div className="mx-auto max-w-2xl">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your prompt here... (e.g. A neon city with flying cars)"
            className="w-full resize-none rounded-xl bg-zinc-950/90 border border-zinc-700 
            text-base leading-relaxed placeholder-zinc-500 text-zinc-100 p-4 min-h-[160px] 
            focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500/40 
            hover:border-zinc-500 transition-colors"
          />

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="rounded-full bg-pink-900 hover:bg-pink-800 
              text-white px-6 py-3 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Generate
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            {presets.map((p) => (
              <Button
                key={p}
                variant="outline"
                size="sm"
                className="rounded-full border border-white/20 bg-white/5 text-pink-50/80 
                hover:bg-pink-400/20 hover:text-white transition-colors px-4 py-1.5"
                onClick={() => setPrompt(p)}
              >
                {p.split(",")[0]}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-20">
         

          {images && images.some((img) => Boolean(img.url) && img.status === "generated") ? (
            <div className="masonry-grid">
              {images
                .filter((img) => Boolean(img.url) && img.status === "generated")
                .map((image, idx) => (
                  <div
                    key={image._id}
                    className={`masonry-item image-card rounded-xl overflow-hidden border border-white/10 cursor-pointer 
                    ${idx % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"}`}
                    onClick={() => setSelectedImage({ url: image.url!, prompt: image.prompt })}
                  >
                    <Image
                      src={image.url! || "/placeholder.svg"}
                      alt={image.prompt}
                      width={600}
                      height={600}
                      className="w-full h-auto object-cover"
                      quality={85}
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-16 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
              <p className="text-pink-100/70">No images yet. Start by generating one!</p>
            </div>
          )}
        </div>
      </div>


      {selectedImage && (
        <ImagePopup
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          prompt={selectedImage.prompt}
        />
      )}
    </div>
  )
}
