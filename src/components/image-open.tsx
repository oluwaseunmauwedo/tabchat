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
      <DialogContent
        className="max-w-5xl bg-[--sidebar] text-[--sidebar-foreground] border border-[--sidebar-border] shadow-2xl rounded-2xl p-6 glass-effect"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[--primary] tracking-tight">
            Generated Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg border border-[--border]">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={prompt}
              fill
              className="object-contain bg-black/30"
              quality={95}
              unoptimized
            />
          </div>

          {/* Prompt Box */}
          <div className="space-y-2">
            <h3 className="font-medium text-[--accent]">Prompt:</h3>
            <p className="text-sm leading-relaxed bg-[--muted] text-[--muted-foreground] p-4 rounded-lg border border-[--border]">
              {prompt}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement("a")
                link.href = imageUrl
                link.download = "generated-image.png"
                link.click()
              }}
              className="bg-[--accent]/20 text-[--accent-foreground] border border-[--accent] hover:bg-[--accent]/30 transition-colors rounded-lg"
            >
              Download
            </Button>
            <Button
              onClick={onClose}
              className="bg-[--primary]/20 text-[--primary-foreground] hover:bg-[--primary]/30 transition-colors rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
