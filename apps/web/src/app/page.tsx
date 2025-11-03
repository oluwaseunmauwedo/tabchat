"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import UserProfile from "@/components/user-profile";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { useEffect } from "react";

const CircularGallery = dynamic(() => import("@/components/CircularGallery"), { ssr: true });

export default function Home() {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const user = session?.user

  useEffect(() => {
    if (session?.user) {
      router.push('/generate');
    }
  }, [session, router]);

  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </Authenticated>
      
      <Unauthenticated>
    <div className="relative min-h-screen overflow-hidden">

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.muted.DEFAULT)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.08] dark:opacity-[0.04]" />
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl bg-primary/10 dark:bg-primary/8" />
        <div className="absolute -bottom-32 right-1/4 h-[24rem] w-[24rem] rounded-full blur-3xl bg-accent/8 dark:bg-accent/5" />
        <div className="absolute inset-0 [mask-image:radial-gradient(transparent_0,black_50%,black)] bg-gradient-to-b from-background/0 via-background/0 to-background/50" />
      </div>

      <div className="fixed top-6 right-6 sm:right-12 z-20">
        {user ? (
          <UserProfile />
        ) : (
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 pb-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="text-center space-y-8 lg:space-y-10">
            
            <div className="space-y-5">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-[0.95]">
                <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  tab.chat
                </span>
              </h1>
              <p className="text-balance text-xl sm:text-2xl lg:text-3xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light">
                Create images. Chat with AI. All in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="px-8 py-6 text-base sm:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all">
                <Link href="/generate" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-base sm:text-lg font-medium rounded-full">
                <Link href="/chat">Try Chat</Link>
              </Button>
            </div>

            {/* Gallery Section */}
            <div className="mt-16 lg:mt-20">
              <div className="relative mx-auto max-w-10xl overflow-hidden">
                <div className="h-[500px] sm:h-[580px] lg:h-[650px]">
                  <CircularGallery
                    items={[
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/87a30c3d-0022-43be-a5bc-ba8b9009d4bd', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/133cadb2-abd4-4deb-b911-c8d94e161aa3', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/2eb8c85d-3f80-4beb-bdcb-1285c7485112', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/daee1474-ba74-4ff2-8158-c9e12d5a5b0a', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/c5e742d7-3b97-4046-8f3d-da6e3491f903', text: '' },
                      { image: 'https://curious-corgi-727.convex.cloud/api/storage/049d0b23-2904-46a4-8466-82cb31fb0e6e', text: '' },
                    ]}
                    bend={3}
                    borderRadius={0.06}
                    textColor="#e5e7eb"
                    font="bold 28px Figtree"
                    scrollSpeed={2}
                    scrollEase={0.06}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </Unauthenticated>
    </>
  );
}