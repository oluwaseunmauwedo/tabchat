import { useMutation } from "convex/react";
import { useCallback, useEffect, useState, useRef } from "react";
import { api } from "@imageflow/convex/_generated/api";

export function useDemoThread(title: string) {
  const createThread = useMutation(api.thread.createNewThread);
  const [threadId, setThreadId] = useState<string | undefined>(
    typeof window !== "undefined" ? getThreadIdFromHash() : undefined,
  );
  const threadIdRef = useRef(threadId);

  // Update ref when threadId changes
  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);

  // Listen for hash changes and update threadId immediately
  useEffect(() => {
    function checkAndUpdateHash() {
      const hashThreadId = getThreadIdFromHash();
      if (hashThreadId && hashThreadId !== threadIdRef.current) {
        setThreadId(hashThreadId);
      }
    }
    
    // Check hash on mount
    checkAndUpdateHash();
    
    window.addEventListener("hashchange", checkAndUpdateHash);
    // Also listen for popstate (back/forward navigation)
    window.addEventListener("popstate", checkAndUpdateHash);
    
    // Poll for hash changes (in case router.push doesn't trigger hashchange)
    // Using a longer interval to be less aggressive
    const intervalId = setInterval(checkAndUpdateHash, 200);
    
    return () => {
      window.removeEventListener("hashchange", checkAndUpdateHash);
      window.removeEventListener("popstate", checkAndUpdateHash);
      clearInterval(intervalId);
    };
  }, []);

  const resetThread = useCallback(() => {
    return createThread({
      title,
    }).then((newId) => {
      window.location.hash = newId as string;
      setThreadId(newId as string);
    });
  }, [createThread, title]);

  // On mount or when threadId changes, if no threadId, create one and set hash
  useEffect(() => {
    if (!threadId) {
      void resetThread();
    }
  }, [resetThread, threadId]);

  return { threadId, resetThread, setThreadId };
}

function getThreadIdFromHash() {
  return window.location.hash.replace(/^#/, "") || undefined;
}