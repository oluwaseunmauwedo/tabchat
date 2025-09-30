import { preloadQuery } from "convex/nextjs";
import { api } from "@imageflow/convex/_generated/api";
import GalleryWrapper from "@/components/gallery-wrapper";


export default async function Gallery() {
    const image = await preloadQuery(api.image.getImages);

    return <GalleryWrapper preloadedImages={image} />;
}
