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
    "A pastel orange wall with an arched door and a vintage blue car parked in front, creating a charming retro aesthetic.",
    "Moody portrait of a person in motion, with dramatic lighting highlighting their hair and white t-shirt against a dark background.",
    "Artistic portrait of a young woman with colorful lighting and bokeh effects, creating a dreamy and ethereal atmosphere"
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage({ prompt, imageWidth: 1024, imageHeight: 1024, numberOfImages: 1 })
    setPrompt("")
  }

  return (
    <div className="min-h-screen relative overflow-y-auto text-foreground">
      <div className="relative max-w-6xl mx-auto px-6 py-14 z-10">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Create Your Vision
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your dream, and we&apos;ll <span className="font-semibold">bring it to life</span>.
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="relative group">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write your prompt here... (e.g. A neon city with flying cars)"
              className="w-full resize-none rounded-2xl bg-card border border-border 
              text-base leading-relaxed placeholder-muted-foreground text-foreground p-4 pr-32 min-h-[160px] 
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring 
              hover:border-border transition-colors"
            />
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="absolute bottom-3 right-3 h-11 rounded-full bg-primary hover:bg-primary/90 
              text-primary-foreground px-6 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              aria-label="Generate image"
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
                className="rounded-full border border-border bg-secondary text-secondary-foreground 
                hover:bg-accent hover:text-accent-foreground transition-colors px-4 py-1.5"
                onClick={() => setPrompt(p)}
              >
                {p.split(",")[0]}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-20">
         

          {images && images.some((img) => Boolean(img.url) && img.status === "generated") ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2">
              {images
                .filter((img) => Boolean(img.url) && img.status === "generated")
                .map((image, idx) => (
                  <div
                    key={image._id}
                    className={`cursor-pointer 
                    ${idx % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"}`}
                    onClick={() => setSelectedImage({ url: image.url!, prompt: image.prompt })}
                  >
                    <Image
                      src={image.url! || "/placeholder.svg"}
                      alt={image.prompt}
                      width={300}
                      height={300}
                      className="w-full h-auto object-cover aspect-square"
                      quality={85}
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                ))}
            </div>
          ) : (
            null
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
