"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ImageTrail from "@/components/ImageTrail";
import { useState } from "react";

export default function Home() {
  const [key, setKey] = useState(0);
  
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto w-full">

          <div className="text-center space-y-10 lg:space-y-12">
            

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9]">
                <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  picflow
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Transform your creative vision into stunning visuals with AI
              </p>
            </div>


            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button asChild variant="secondary" size="lg" className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium rounded-4xl">
                <Link href="/generate" className="flex items-center">
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium rounded-4xl">
                <Link href="/dashboard">
                  View Gallery
                </Link>
              </Button>
            </div>


            <div className="mt-16 lg:mt-20">
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold">Try it yourself</h2>
                <p className="text-muted-foreground">Move your mouse around the area below to see the magic</p>
              </div>
              

              <div className="relative mx-auto max-w-4xl">
                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 to-muted/5">
                  <ImageTrail
                    key={key}
                    items={[
                      'https://picsum.photos/id/287/400/400',
                      'https://picsum.photos/id/1001/400/400',
                      'https://picsum.photos/id/1025/400/400',
                      'https://picsum.photos/id/1026/400/400',
                      'https://picsum.photos/id/1027/400/400',
                      'https://picsum.photos/id/1028/400/400',
                      'https://picsum.photos/id/1029/400/400',
                      'https://picsum.photos/id/1030/400/400',
                    ]}
                    variant={1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}