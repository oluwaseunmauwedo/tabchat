"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { UploadButton } from "@/utils/uploadthing"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PaperclipIcon, XIcon } from "@/components/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ImageUploaderProps = {
  value?: string
  onChange: (url: string) => void
  className?: string
  size?: number
}

export function ImageUploader({ value, onChange, className, size = 40 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)
  const [, setProgress] = useState(0)

  const handleClear = useCallback(() => {
    onChange("")
  }, [onChange])

  if (value) {
    return (
      <div className={cn("w-full max-w-full", className)}>
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-3">
          <div className="relative overflow-hidden rounded-xl ring-1 ring-border/60" style={{ width: size, height: size }}>
            <div className="relative h-full w-full overflow-hidden bg-muted">
              {isImageLoading && (
                <div className="absolute inset-0 animate-pulse bg-muted/60" />
              )}
              <Image
                src={value}
                alt="Uploaded image preview"
                fill
                className={cn("object-cover", isImageLoading ? "opacity-60" : "opacity-100")}
                sizes="(max-width: 768px) 100vw, 300px"
                unoptimized
                onLoadingComplete={() => setIsImageLoading(false)}
                onError={() => setIsImageError(true)}
              />
              {isImageError && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Preview unavailable</div>
              )}
            </div>
          </div>

            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground/90">Image uploaded</p>
              <p className="truncate text-xs text-muted-foreground">Click preview for a larger view</p>
            </div>

            <div className="flex items-center gap-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-8 px-3 rounded-lg border border-border/60">
                    Preview
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[320px] p-2">
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted">
                    <Image src={value} alt="Preview" fill className="object-contain" sizes="320px" unoptimized />
                  </div>
                </PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <UploadButton
                      endpoint="imageUploader"
                      disabled={isUploading}
                      onUploadBegin={() => setIsUploading(true)}
                      onUploadProgress={(p) => {
                        setProgress(p)
                        if (!isUploading) setIsUploading(true)
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false)
                        setTimeout(() => setProgress(0), 300)
                        if (res && res.length > 0) onChange(res[0].ufsUrl)
                      }}
                      onUploadError={() => { setIsUploading(false); setProgress(0) }}
                      content={{
                        allowedContent: "hidden",
                        button: () => (
                          <span className="inline-flex h-8 items-center gap-2 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground/90 shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                            {isUploading ? (
                              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <>
                                <PaperclipIcon className="h-3.5 w-3.5" />
                                <span>Replace</span>
                              </>
                            )}
                          </span>
                        ),
                      }}
                      appearance={{
                        container: "ut-inline-block [&_[data-ut-element=button]]:ut-relative [&_[data-ut-element=button]]:ut-z-10",
                        button: "ut-h-8 ut-rounded-lg ut-border ut-border-border/60 ut-bg-background ut-text-foreground/90 hover:ut-bg-accent hover:ut-text-accent-foreground ut-flex ut-items-center ut-gap-2 ut-px-3 ut-text-sm ut-transition-colors ut-border-none focus:ut-outline-none",
                        allowedContent: "hidden",
                      }}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Replace</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-lg border border-border/60"
                    onClick={handleClear}
                    aria-label="Remove image"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="group relative w-full cursor-pointer rounded-2xl border border-dashed border-border/60 bg-card/30 p-4 transition-colors hover:border-border hover:bg-card/50">
        <div className="pointer-events-none absolute inset-0 rounded-2xl" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Upload an image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <UploadButton
            endpoint="imageUploader"
            disabled={isUploading}
            onUploadBegin={() => setIsUploading(true)}
            onUploadProgress={(p) => {
              setProgress(p)
              if (!isUploading) setIsUploading(true)
            }}
            onClientUploadComplete={(res) => {
              setIsUploading(false)
              setTimeout(() => setProgress(0), 300)
              if (res && res.length > 0) onChange(res[0].ufsUrl)
            }}
            onUploadError={() => { setIsUploading(false); setProgress(0) }}
            content={{
              allowedContent: "hidden",
              button: () => (
                <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground/90 shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                  {isUploading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <>
                      <PaperclipIcon className="h-4 w-4" />
                    </>
                  )}
                </span>
              ),
            }}
            appearance={{
              container: "ut-inline-block [&_[data-ut-element=button]]:ut-relative [&_[data-ut-element=button]]:ut-z-10",
              button: "ut-h-9 ut-rounded-lg ut-border ut-border-border/60 ut-bg-background ut-text-foreground/90 hover:ut-bg-accent hover:ut-text-accent-foreground ut-flex ut-items-center ut-gap-2 ut-px-3 ut-text-sm ut-transition-colors ut-border-none focus:ut-outline-none",
              allowedContent: "hidden",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ImageUploader


