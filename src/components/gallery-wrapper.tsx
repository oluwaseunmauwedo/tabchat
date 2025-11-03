
"use client";

import Gallery from "@/components/gallery";
import SignInUpWrapper from "./sign-in-up-wrapper";
import { Preloaded } from "convex/react";

import {
    Authenticated,
    Unauthenticated,
} from "convex/react";
import { api } from "../../convex/_generated/api";

export default function GalleryWrapper({ preloadedImages }: { preloadedImages: Preloaded<typeof api.image.getImages> }) {
    return (
        <>
            <Authenticated>
                <Gallery images={preloadedImages} />
            </Authenticated>
            <Unauthenticated>
                <SignInUpWrapper />
            </Unauthenticated>
        </>
    );
}
