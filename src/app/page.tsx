import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen relative z-10">
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <div className="animate-fade-in-up">
              <h2 className="hero-title text-7xl md:text-9xl text-white mb-12 text-balance italic font-light">
                Create Beyond
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent font-bold">
                  Imagination
                </span>
              </h2>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <p className="premium-text text-2xl md:text-3xl text-white/70 mb-16 text-pretty max-w-4xl mx-auto leading-relaxed">
                Where creativity meets cutting-edge AI. Transform your ideas into breathtaking visuals that captivate
                and inspire.
              </p>
            </div>

            <div
              className="animate-fade-in-up flex items-center justify-center gap-8"
              style={{ animationDelay: "0.4s", opacity: 0 }}
            >
              <button className="bg-white text-black px-10 py-5 rounded-full font-semibold text-xl hover:bg-white/90 transition-all duration-300 flex items-center gap-3 shadow-2xl">
                Start Creating
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
