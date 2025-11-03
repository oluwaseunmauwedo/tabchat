"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DownloadIcon, CopyIcon, ExternalLinkIcon } from "@/components/icons"
import { useState } from "react"

interface ImagePopupProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  prompt: string
}

export default function ImagePopup({ isOpen, onClose, imageUrl, prompt }: ImagePopupProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `generated-image-${Date.now()}.png`
    link.click()
  }

  const handleOpenInNewTab = () => {
    window.open(imageUrl, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full mx-4 bg-background/95 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-3xl p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Generated Image</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border/20 bg-gradient-to-r from-background/80 to-background/60">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Generated Image
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenInNewTab}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="relative group">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5 border border-border/30 shadow-lg">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={prompt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                quality={95}
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Button
                  size="sm"
                  onClick={handleDownload}
                  className="bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/40 text-white shadow-lg"
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleOpenInNewTab}
                  className="bg-white/20 backdrop-blur-md border border-white/20 hover:bg-white/40 text-gray-900 shadow-lg"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
                <h3 className="text-base font-medium text-foreground">
                  Generation Prompt
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPrompt}
                className={`gap-2 transition-all duration-200 ${
                  copied
                    ? 'text-green-600 hover:text-green-700'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <CopyIcon className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 border border-border/20 rounded-xl p-5 backdrop-blur-sm">
                <p className="text-sm text-foreground/90 leading-relaxed font-mono">
                  {prompt}
                </p>
                <div className="absolute top-3 right-3 w-2 h-2 bg-border/40 rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/20">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full" />
                Press <kbd className="px-2 py-1 bg-muted/60 rounded-md text-xs font-mono border border-border/30">Esc</kbd> to close
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="gap-2 border-border/30 hover:border-border/60 hover:bg-muted/50 transition-all duration-200"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                View Full Size
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <DownloadIcon className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
