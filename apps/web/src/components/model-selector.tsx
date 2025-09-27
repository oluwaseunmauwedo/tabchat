"use client"

import { useState } from "react"
import { models } from "@imageflow/convex/model"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { Button } from "./ui/button"

type FilterType = "all" | "text" | "image"

export default function ModelSelector({
  model,
  setModel,
}: {
  model: string
  setModel: (model: string) => void
}) {
  const [filter, setFilter] = useState<FilterType>("all")
  const selectedModel = models.find((m) => m.id === model)
  
  // Filter models based on selected filter
  const filteredModels = models.filter((modelItem) => {
    if (filter === "all") return true
    if (filter === "text") return !modelItem.imageInput
    if (filter === "image") return modelItem.imageInput
    return true
  })

  return (
    <TooltipProvider>
      <Select
        value={model}
        onValueChange={(value) => setModel(value)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger className=" rounded-xl">
              {selectedModel ? (
                <div className="flex items-center justify-between w-full p-2 md:p-3">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-sidebar-primary/80 shadow-sm" />
                    <span className="font-medium text-xs md:text-sm truncate">{selectedModel.name}</span>
                  </div>
                </div>
              ) : (
                <SelectValue placeholder="Select Model" />
              )}
            </SelectTrigger>
          </TooltipTrigger>

          {selectedModel && (
            <TooltipContent
              side="top"
              className="bg-sidebar/95 backdrop-blur-xl border border-sidebar-border/50 text-sidebar-foreground shadow-lg max-w-xs p-4"
            >
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-sidebar-foreground">
                  {selectedModel.name}
                </h4>
                <p className="text-xs text-sidebar-foreground/80 leading-relaxed">
                  {selectedModel.description}
                </p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>

        <SelectContent className="bg-sidebar/95 backdrop-blur-xl border border-sidebar-border/50 rounded-lg w-80 shadow-2xl p-2">
          <div className="flex gap-1 mb-3 p-1 bg-sidebar-accent/20 rounded-md">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={`flex-1 h-8 text-xs font-medium transition-all ${
                filter === "all"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
              }`}
            >
              All ({models.length})
            </Button>
            <Button
              variant={filter === "text" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("text")}
              className={`flex-1 h-8 text-xs font-medium transition-all ${
                filter === "text"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
              }`}
            >
              Text ({models.filter(m => !m.imageInput).length})
            </Button>
            <Button
              variant={filter === "image" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("image")}
              className={`flex-1 h-8 text-xs font-medium transition-all ${
                filter === "image"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
              }`}
            >
              Image ({models.filter(m => m.imageInput).length})
            </Button>
          </div>
          
          {filteredModels.map((modelItem) => (
            <SelectItem
              key={modelItem.id}
              value={modelItem.id}
              className="w-full p-0 hover:bg-sidebar-accent/30 focus:bg-sidebar-accent/30 transition-colors"
            >
              <div className="flex flex-col items-start text-left w-full border border-sidebar-border/40 rounded-md p-4 hover:border-sidebar-border/70 transition-colors">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      model === modelItem.id
                        ? "bg-sidebar-primary shadow-sm shadow-sidebar-primary/30"
                        : "bg-sidebar-border"
                    }`} />
                    <span className="font-semibold text-sm text-sidebar-foreground">
                      {modelItem.name}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium cursor-help ${
                          modelItem.imageInput 
                            ? "bg-sidebar-accent/40 text-sidebar-foreground/90 border border-sidebar-border/30" 
                            : "bg-sidebar-accent/20 text-sidebar-foreground/70 border border-sidebar-border/20"
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${
                            modelItem.imageInput ? "bg-sidebar-primary" : "bg-sidebar-border"
                          }`} />
                          {modelItem.imageInput ? "Image" : "Text"}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-sidebar/95 backdrop-blur-xl border border-sidebar-border/50 text-sidebar-foreground shadow-lg max-w-xs p-3"
                      >
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm text-sidebar-foreground">
                            {modelItem.imageInput ? "Image-to-Image Model" : "Text-to-Image Model"}
                          </h4>
                          <p className="text-xs text-sidebar-foreground/80 leading-relaxed">
                            {modelItem.imageInput 
                              ? "This model can transform and modify existing images based on your prompts. Upload an image and describe the changes you want to make."
                              : "This model generates images from text descriptions only. Provide a detailed prompt describing the image you want to create."
                            }
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <p className="text-sidebar-foreground/70 text-xs leading-relaxed">
                  {modelItem.description}
                </p>
                
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TooltipProvider>
  )
}
