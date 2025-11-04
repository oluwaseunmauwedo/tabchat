"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { SearchIcon, ChevronDownIcon, ExternalLinkIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";

export type WebSearchProps = ComponentProps<typeof Collapsible>;

export const WebSearch = ({ className, ...props }: WebSearchProps) => (
  <Collapsible
    className={cn("not-prose mb-4 text-primary text-xs", className)}
    {...props}
  />
);

export type WebSearchTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  query?: string;
  resultCount?: number;
};

export const WebSearchTrigger = ({
  className,
  query,
  resultCount = 0,
  children,
  ...props
}: WebSearchTriggerProps) => (
  <CollapsibleTrigger
    className={cn("flex items-center gap-2", className)}
    {...props}
  >
    {children ?? (
      <>
        <SearchIcon className="h-4 w-4" />
        <p className="font-medium">
          {query ? `Searched: "${query}"` : "Web Search"}
        </p>
        {resultCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </Badge>
        )}
        <ChevronDownIcon className="h-4 w-4" />
      </>
    )}
  </CollapsibleTrigger>
);

export type WebSearchContentProps = ComponentProps<typeof CollapsibleContent>;

export const WebSearchContent = ({
  className,
  ...props
}: WebSearchContentProps) => (
  <CollapsibleContent
    className={cn(
      "mt-3 flex w-full flex-col gap-3",
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    )}
    {...props}
  />
);

export type WebSearchResultProps = ComponentProps<"a"> & {
  title: string;
  url: string;
  snippet?: string;
  publishedDate?: string;
};

export const WebSearchResult = ({
  href,
  title,
  url,
  snippet,
  publishedDate,
  className,
  children,
  ...props
}: WebSearchResultProps) => (
  <a
    href={href || url}
    rel="noreferrer"
    target="_blank"
    className={cn(
      "group flex flex-col gap-2 rounded-lg border border-border/60 bg-card/40 p-4 transition-all hover:border-border hover:bg-card/60 hover:shadow-md",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
            {title}
          </h4>
          <ExternalLinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        </div>
        {snippet && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {snippet}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{new URL(url).hostname}</span>
          {publishedDate && (
            <>
              <span>•</span>
              <span>{new Date(publishedDate).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </>
    )}
  </a>
);

