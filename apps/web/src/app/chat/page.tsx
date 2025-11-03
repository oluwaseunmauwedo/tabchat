"use client"
import { useMutation, useAction } from "convex/react";
import { api } from "@imageflow/convex/_generated/api";
import {
  optimisticallySendMessage,
  useSmoothText,
  useUIMessages,
  type UIMessage,
} from "@convex-dev/agent/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Square, ArrowUp, Paperclip, X } from "lucide-react";
import ChatModelSelector from "@/components/chat-model-selector";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import SignInUpWrapper from "@/components/sign-in-up-wrapper";

import { chatModel } from "@imageflow/convex/chatModel";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import LoadingDots from "@/components/loading-dots";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source,
} from "@/components/ai-elements/sources";


export default function ChatStreaming() {
  const [threadId, setThreadId] = useState<string | undefined>(() => {
    if (typeof window !== "undefined") {
      return window.location.hash.replace(/^#/, "") || undefined;
    }
    return undefined;
  });

  useEffect(() => {
    const updateThreadId = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.replace(/^#/, "");
        setThreadId(hash || undefined);
      }
    };
    
    updateThreadId();
    window.addEventListener("hashchange", updateThreadId);
    return () => window.removeEventListener("hashchange", updateThreadId);
  }, []);

  return (
    <>
      <Authenticated>
        <div className="flex flex-col h-screen">
          <div className="flex-1 flex flex-col overflow-hidden">
            {threadId ? (
              <Story threadId={threadId} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Select a chat to start...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <SignInUpWrapper />
      </Unauthenticated>
      <AuthLoading>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AuthLoading>
    </>
  );
}

function Story({ threadId }: { threadId: string }) {
  const [selectedModel, setSelectedModel] = useState(chatModel[0].id);
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const {
    results: messages,
    status,
    loadMore,
  } = useUIMessages(
    api.chatStreaming.listThreadMessages,
    { threadId },
    { initialNumItems: 10, stream: true },
  );
  
  const sendMessage = useMutation(
    api.chatStreaming.initiateAsyncStreaming,
  ).withOptimisticUpdate(
    optimisticallySendMessage(api.chatStreaming.listThreadMessages),
  );
  const abortStreamByOrder = useMutation(
    api.chatStreaming.abortStreamByOrder,
  );
  const updateThreadTitle = useAction(api.thread.updateThreadTitle);
  const titleUpdatedRef = useRef(false);
  const isStreaming = messages.some((m) => m.status === "streaming");

  useEffect(() => {
    titleUpdatedRef.current = false;
  }, [threadId]);

  function onSendClicked() {
    const text = prompt.trim();
    if (!text) return;
    
    const isFirstMessage = messages.length === 0;
    void sendMessage({ 
      threadId, 
      prompt: text, 
      model: selectedModel,
      url: url || "",

    }).catch(() => {
    });
    
    setPrompt("");
    setUrl(""); 
    
    if (isFirstMessage && !titleUpdatedRef.current) {
      titleUpdatedRef.current = true;
      setTimeout(() => {
        updateThreadTitle({ threadId }).catch(console.error);
      }, 1000);
    }
  }

  function handleAbort() {
    const order = messages.find((m) => m.status === "streaming")?.order ?? 0;
    void abortStreamByOrder({ threadId, order });
  }

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 md:px-6 overflow-hidden">

      <Conversation className="flex-1">
        <ConversationContent className="pt-16 pb-6">
          <div className="max-w-[80%] mx-auto space-y-3">
            {status === "CanLoadMore" && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadMore(4)}
                  className="text-muted-foreground"
                >
                  Load more messages
                </Button>
              </div>
            )}
            {messages.map((m) => (
              <ChatMessage key={m.key} message={m} />
            ))}
          </div>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 pt-6 pb-0 border-t border-border/50">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            onSendClicked();
          }}
        >
          <div className="flex-1 relative max-w-[80%] mx-auto">
            <div className="relative rounded-t-xl rounded-b-none border border-border/60 bg-background/90 backdrop-blur-md shadow-xl shadow-black/10 dark:shadow-black/20 ring-1 ring-border/20">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
                    e.preventDefault();
                    onSendClicked();
                  }
                }}
                className="w-full min-h-[140px] max-h-[400px] rounded-t-xl rounded-b-none border-0 bg-transparent placeholder:text-muted-foreground/60 resize-none pr-14 pb-12 pt-5 px-5 text-base focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed"
                placeholder={
                  messages.length > 0
                    ? "Continue the conversation..."
                    : "Type your message here..."
                }
                disabled={isStreaming}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <ChatModelSelector model={selectedModel} setModel={setSelectedModel} />
                {url && (
                  <div className="relative rounded-lg border border-border/60 bg-card/40 p-1.5 flex items-center gap-1.5 ml-1">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={url}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                        sizes="32px"
                        unoptimized
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setUrl("")}
                      className="h-5 w-5 rounded-md hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <UploadButton
                  endpoint="imageUploader"
                  disabled={isStreaming || isUploading}
                  onUploadBegin={() => setIsUploading(true)}
                  onClientUploadComplete={(res) => {
                    setIsUploading(false);
                    if (res && res.length > 0) {
                      setUrl(res[0].ufsUrl);
                    }
                  }}
                  onUploadError={() => {
                    setIsUploading(false);
                  }}
                  content={{
                    allowedContent: "attachment",
                    button: () => (
                      <span className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all cursor-pointer",
                        isUploading || isStreaming
                          ? "text-muted-foreground/50 cursor-not-allowed bg-muted/50"
                          : "text-muted-foreground bg-muted/60 hover:bg-muted hover:text-foreground border border-border/40 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                      )}>
                        {isUploading ? (
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <Paperclip className="h-4 w-4" />
                        )}
                      </span>
                    ),
                  }}
                  appearance={{
                    container: "ut-inline-block [&_[data-ut-element=button]]:ut-relative [&_[data-ut-element=button]]:ut-z-10",
                    button: "ut-border-none ut-bg-transparent ut-p-0 ut-shadow-none ut-outline-none ut-cursor-pointer",
                    allowedContent : "hidden",
                  }}
                />
                {isStreaming ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleAbort}
                    className="h-9 w-9 rounded-lg shadow-md transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <Square className="h-3 w-3 fill-current" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!prompt.trim()}
                    className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const isStreaming = message.status === "streaming";
  const isFailed = message.status === "failed";
  const [visibleText] = useSmoothText(message.text, {
    startStreaming: isStreaming,
  });

  const sourceParts = message.parts.filter((p) => p.type === "source-url");
  const hasSources = sourceParts.length > 0;

  const reasoningParts = message.parts.filter((p) => p.type === "reasoning");

  const textParts = message.parts.filter((p) => p.type === "text");

  if (isUser) {
    return (
      <Message from="user">
        <MessageContent
          variant="contained"
          className={cn(
            "rounded-2xl shadow-sm",
            isFailed && "bg-destructive/10 border-destructive/20 text-destructive"
          )}
        >
          {visibleText && <Response>{visibleText}</Response>}
          {message.parts
            .filter((part) => part.type === "file" && (part as any).mediaType?.startsWith("image/"))
            .length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.parts
                  .filter((part) => part.type === "file" && (part as any).mediaType?.startsWith("image/"))
                  .map((part, idx) => (
                    <div
                      key={`user-message-image-${idx}`}
                      className="relative group rounded-xl overflow-hidden border border-border/40 bg-muted/30 hover:border-border/60 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={(part as any).url}
                        className="max-w-[280px] max-h-[280px] min-w-[120px] min-h-[120px] w-auto h-auto object-cover"
                        alt="Uploaded image"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    </div>
                  ))}
              </div>
            )}
        </MessageContent>
      </Message>
    );
  }

  return (
    <Message from="assistant">
      <MessageContent
        variant="flat"
        className={cn(
          "w-full",
          isFailed && "bg-destructive/10 border-destructive/20 text-destructive rounded-2xl px-4 py-3"
        )}
      >

        {hasSources && (
          <Sources className="mb-4">
            <SourcesTrigger count={sourceParts.length} />
            {sourceParts.map((part, i) => (
              <SourcesContent key={`${message.key}-source-${i}`}>
                <Source href={part.url || ""} title={part.url || ""} />
              </SourcesContent>
            ))}
          </Sources>
        )}

        {reasoningParts.length > 0 && (
          <ReasoningParts
            parts={reasoningParts}
            messageKey={message.key}
            isStreaming={isStreaming}
          />
        )}

        {textParts.length > 0 && (
          <TextParts
            parts={textParts}
            messageKey={message.key}
            isStreaming={isStreaming}
          />
        )}

        {message.parts.length === 0 && (
          <div className="leading-relaxed text-base text-foreground/90">
            {visibleText ? (
              <Response>{visibleText}</Response>
            ) : isStreaming ? (
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <LoadingDots />
              </span>
            ) : null}
          </div>
        )}
      </MessageContent>
    </Message>
  );
}

function ReasoningParts({
  parts,
  messageKey,
  isStreaming,
}: {
  parts: Array<{ text?: string }>;
  messageKey: string;
  isStreaming: boolean;
}) {
  const combinedReasoningText = parts.map((p) => p.text || "").join("\n");
  const [reasoningText] = useSmoothText(combinedReasoningText, {
    startStreaming: isStreaming,
  });

  if (!reasoningText) return null;

  return (
    <Reasoning
      key={`${messageKey}-reasoning`}
      isStreaming={isStreaming}
      className="mb-4"
    >
      <ReasoningTrigger />
      <ReasoningContent>{reasoningText}</ReasoningContent>
    </Reasoning>
  );
}

function TextParts({
  parts,
  messageKey,
  isStreaming,
}: {
  parts: Array<{ text?: string }>;
  messageKey: string;
  isStreaming: boolean;
}) {
  const combinedText = parts.map((p) => p.text || "").join("");
  const [partText] = useSmoothText(combinedText, {
    startStreaming: isStreaming,
  });

  return (
    <div className="leading-relaxed text-base text-foreground/90">
      {partText ? (
        <Response>{partText}</Response>
      ) : isStreaming ? (
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <LoadingDots />
        </span>
      ) : null}
    </div>
  );
}