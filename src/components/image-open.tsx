"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImagePopupProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  prompt: string
}

export default function ImagePopup({ isOpen, onClose, imageUrl, prompt }: ImagePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-8xl bg-zinc-900/90 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">Generated Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative aspect-square w-full max-w-2xl mx-auto">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={prompt}
              fill
              className="object-contain rounded-lg"
              quality={95}
              unoptimized
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-gray-300">Prompt:</h3>
            <p className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg">{prompt}</p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement("a")
                link.href = imageUrl
                link.download = "generated-image.png"
                link.click()
              }}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Download
            </Button>
            <Button onClick={onClose} className="bg-white/20 hover:bg-white/30">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
