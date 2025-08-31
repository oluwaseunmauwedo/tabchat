"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = useMutation(api.images.generate.scheduleImageGeneration);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const base64Image = await generateImage({ prompt: prompt.trim(), model: "dall-e-3", imageWidth: 1024, imageHeight: 1024, numberOfImages: 1 });
      setGeneratedImage(base64Image);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Panel - Prompt Input */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-2xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20"
        >
          <h1 className="text-4xl font-extrabold text-white mb-6">
            AI Image Studio
          </h1>
          <p className="text-gray-300 mb-6 text-lg">
            Describe your dream image and let AI bring it to life. 
          </p>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g. A cyberpunk cat wearing sunglasses on a neon-lit rooftop..."
            rows={4}
            className="w-full resize-none px-4 py-3 rounded-2xl border border-gray-500/40 bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all mb-6"
            disabled={isGenerating}
          />
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-105"
          >
            {isGenerating ? "Generating..." : "Generate Image"}
          </button>
        </motion.div>

        {/* Right Panel - Image Preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center justify-center p-6 relative"
        >
          {!generatedImage && !isGenerating && (
            <p className="text-gray-400 text-center">
              Your image will appear here once generated
            </p>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              <p className="mt-4 text-gray-300 text-lg">Generating your masterpiece...</p>
            </div>
          )}

          {generatedImage && (
            <>
              <motion.img
                src={`data:image/png;base64,${generatedImage}`}
                alt="AI Generated"
                className="max-w-full max-h-[600px] rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `data:image/png;base64,${generatedImage}`;
                    link.download = "generated-image.png";
                    link.click();
                  }}
                  className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all shadow-lg hover:scale-105"
                >
                  Download Image
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
