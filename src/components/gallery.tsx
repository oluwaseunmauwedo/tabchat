"use client"

import { useState } from "react"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import Image from "next/image"
import ImagePopup from "@/components/image-open"

export default function Gallery({ images }: { images: Preloaded<typeof api.image.getImages> }) {
  const [selectedImage, setSelectedImage] = useState<{ url: string; prompt: string } | null>(null)
  const imagesData = usePreloadedQuery(images)

  return (
    <div className="min-h-screen relative text-foreground">
      <div className="relative max-w-7xl mx-auto px-6 py-16 z-10">
        <div className="mb-20 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-4">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Your <span className="font-medium text-primary">creative journey</span> in pixels
          </p>
        </div>

        {/* Gallery Grid */}
                <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10 opacity-60" />

          {imagesData && Array.isArray(imagesData) && imagesData.some((img) => Boolean(img.url) && img.status === "generated") ? (
            <div className="relative">
              {/* Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-0">
              {imagesData
                .filter((img) => Boolean(img.url) && img.status === "generated")
                .map((image, idx: number) => (
                  <div
                    key={image._id}
                      className="group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                    onClick={() => setSelectedImage({ url: image.url!, prompt: image.prompt })}
                  >
                      <div className="relative overflow-hidden bg-gradient-to-br from-background/30 to-background/5 backdrop-blur-sm border border-border/5 shadow-lg hover:shadow-xl transition-all duration-700 hover:scale-[1.02] group aspect-square">
                        {/* Image container */}
                        <div className="relative w-full h-full overflow-hidden">
                          <Image
                            src={image.url! || "/placeholder.svg"}
                            alt={image.prompt}
                            fill
                            className="object-cover transition-all duration-1000 group-hover:scale-105"
                            quality={95}
                            loading="lazy"
                            unoptimized
                          />

                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Elegant hover indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Empty state */}
              <div className="text-center py-32">
                <div className="max-w-lg mx-auto">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-primary/20 shadow-lg">
                    <svg className="w-16 h-16 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">Your canvas awaits</h3>
                  <p className="text-muted-foreground/80 leading-relaxed">
                    Every masterpiece begins with a single pixel. Start creating and watch your gallery come alive.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Popup */}
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
