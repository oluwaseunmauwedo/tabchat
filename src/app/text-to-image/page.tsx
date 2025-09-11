"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
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
    <div className="min-h-screen bg-zinc-950 text-white overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Create your vision</h2>
          <p className="mt-3 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
            Turn ideas into images. Describe what you want and we’ll craft it.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 border border-white/10 bg-zinc-900 rounded-3xl shadow-lg p-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your image idea in detail..."
              className="flex-1 resize-none border-0 bg-transparent text-lg leading-relaxed focus:outline-none outline-none min-h-[120px] focus-visible:ring-0 focus:ring-0 ring-0 hover:ring-0 focus-visible:border-transparent focus:border-transparent hover:border-transparent"
            />
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700 px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              Generate
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {presets.map((p) => (
              <Button
                key={p}
                variant="outline"
                size="sm"
                className="rounded-full border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                onClick={() => setPrompt(p)}
              >
                {p.split(",")[0]}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center">Your creations</h3>

          {images && images.some((img) => Boolean(img.url) && img.status === "generated") ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images
                .filter((img) => Boolean(img.url) && img.status === "generated")
                .map((image) => (
                  <div
                    key={image._id}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/30 aspect-square transition-all duration-300 hover:border-white/20 hover:shadow-lg cursor-pointer"
                    onClick={() => setSelectedImage({ url: image.url!, prompt: image.prompt })}
                  >
                    <Image
                      src={image.url! || "/placeholder.svg"}
                      alt={image.prompt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      quality={85}
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-16">
              <p className="text-zinc-500">No images yet</p>
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
