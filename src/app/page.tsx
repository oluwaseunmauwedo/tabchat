"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import Image from "next/image"
import ImagePopup from "@/components/image-open"
import ModelSelector from "@/components/model-selector"
import { models } from "../../convex/model"


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

  const [model, setModel] = useState(models[0].id)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage({ prompt, imageWidth: 1024, imageHeight: 1024, numberOfImages: 1, model: model })
    setPrompt("")
  }

  


  return (
    <div className="h-full relative text-foreground">
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
          <div className="relative group p-4 -m-4">
            <div className="absolute inset-0 bg-gradient-to-r from-card/10 via-card/20 to-card/10 backdrop-blur-2xl rounded-3xl -z-10 opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-700"></div>
            <div className="absolute inset-1 bg-card/5 backdrop-blur-xl rounded-2xl -z-10 opacity-0 group-hover:opacity-80 group-focus-within:opacity-80 transition-all duration-500"></div>
            <div className="pointer-events-none absolute -inset-4 rounded-[28px] bg-gradient-to-r from-primary/30 via-primary/10 to-transparent blur-3xl -z-20 opacity-40 transition-opacity duration-700 group-hover:opacity-70 group-focus-within:opacity-70"></div>

            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write your prompt here... (e.g. A neon city with flying cars)"
                className="w-full rounded-2xl bg-card/95 border border-border/30
                text-base leading-relaxed placeholder-muted-foreground text-foreground p-4 pr-44 pb-20 min-h-[160px] max-h-[60vh] resize-y
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring focus-visible:bg-card/98
                hover:border-border/40 hover:bg-card/98 transition-all duration-300
                shadow-inner relative z-10"
              />

              <div className="pointer-events-none absolute bottom-4 right-4 z-20">
                <div className="flex items-center gap-3 pointer-events-auto">
                  <ModelSelector model={model} setModel={setModel} />

                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="h-10 px-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80
                    text-primary-foreground font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg hover:shadow-xl focus:shadow-xl hover:scale-[1.02] focus:scale-[1.02]
                    border border-primary/20 hover:border-primary/30 backdrop-blur-sm overflow-hidden"
                    aria-label="Generate image"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div className="relative z-10 flex items-center gap-2">
                      <span>Generate</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
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
