import { ToolUIPart } from "ai";
import { WebSearch, WebSearchContent, WebSearchResult, WebSearchTrigger } from "./ai-elements/web-search";

export function WebSearchParts({
    parts,
    messageKey,
  }: {
    parts: ToolUIPart[];
    messageKey: string;
  }) {
    return (
      <>
        {parts.map((part, i) => {
          const input = part.input as { query?: string } | undefined;
          const query = input?.query || "";
          const results = Array.isArray(part.output) ? part.output : [];
          const resultCount = results.length;
  
          return (
            <WebSearch
              key={`${messageKey}-websearch-${i}`}
              className="mb-4"
              defaultOpen={resultCount > 0}
            >
              <WebSearchTrigger query={query} resultCount={resultCount} />
              {resultCount > 0 && (
                <WebSearchContent>
                  {results.map((result: any, idx: number) => {
                    // Extract snippet from content - handle different formats
                    let snippet = "";
                    if (typeof result.content === "string") {
                      snippet = result.content.slice(0, 200);
                    } else if (result.content?.text) {
                      snippet = result.content.text.slice(0, 200);
                    } else if (result.content?.textArray && Array.isArray(result.content.textArray)) {
                      snippet = result.content.textArray.slice(0, 3).join(" ").slice(0, 200);
                    } else if (result.text) {
                      snippet = result.text.slice(0, 200);
                    }
  
                    return (
                      <WebSearchResult
                        key={`${messageKey}-websearch-${i}-result-${idx}`}
                        title={result.title || "Untitled"}
                        url={result.url || ""}
                        snippet={snippet}
                        publishedDate={result.publishedDate}
                      />
                    );
                  })}
                </WebSearchContent>
              )}
            </WebSearch>
          );
        })}
      </>
    );
  }