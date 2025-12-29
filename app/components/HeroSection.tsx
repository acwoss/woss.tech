import { Button } from "@/app/components/ui/button"
import { Star } from "lucide-react"

const clientAvatars = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiKXqnGzo58g4qZ5eONyRc3wOazicG-_iNC-_lX5vQjxE1UKcCDJk8NxhdkrAjD0NTC9FKBsgkcWdN4xOF07rr-qiTAMxriJNo1zqh_1izPG9v-BxgcDrsGZd-oD6aIOFfKToT-8yTlqrKHCUgRW9B8w6N2IwgZIoZ5GLq-XNWc0uop92QGLODbxQ9MOvVbx22NRLUvG-GJ6LNwmZ8-Oz1bsPK3_3caXUq6B-9xeqzzFl287_lJDSG_DAkEx-cdeOFduz0Kwbh6Bg",
    alt: "Portrait of a female client",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD853tXkwXwMoNlioKmK6a8lrXr7D0C1aqbe0bYObh4iLSqEl5OUpM-UY7SV0bS_QJZg-NpZh_vQBQrpztuDwddENRkUUN1thY0Q7jFnRTqi6iT8KhpdLpfBVXyJfLsWVrbVOPwe09I7zCr5wIrZq3VXf6xLrA11f_t6Vsb9tdpJ-QEQ1Ek-tqYgiwyBL8UNiAr9svJbbqIgxR1eANR-BSWbpk_j3sFHLCXa7P75xoHLY0xkRznljdfbKH1o1U2Gkbd279p0N6JeeA",
    alt: "Portrait of a male client",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl_Z02yEhhHgdmcWWb1YSOrGhIK-venJSQ2r8DKNXCD9brmLvPW17Qn8L2RhU2ERkAAcnHZ2eaKDOYMWeud4-t3d0ifOiGPwW1ClNx4I7kAVyQpLzNfHrCMpGN7h0u_mVi5w9BLT_uEa0BkQNrAWZ54SI4a9Uz4i433EpRTjC8bkd-yRheYvNEAOLO6YNcINWAK4eTfY9oD0b0YeDxOCW-gL17Q1aNY36K1Qqjkm-mnTSqCIchezRTbV32ZUwpZcid4yO4g7m_6IQ",
    alt: "Portrait of a male client",
  },
]

export function HeroSection() {
  return (
    <section className="relative px-6 py-20 lg:py-32 flex justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1200px] w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left z-10">
          {/* Badge */}
          <div className="inline-flex items-center self-center lg:self-start gap-2 px-3 py-1 rounded-full bg-border-dark/50 border border-border-dark w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-300">Accepting new enterprise clients</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
            Transforming Businesses Through{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">
              Intelligent Tech
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Expert IT consulting in Cloud Architecture, Cyber Security, and AI. We build the resilient digital infrastructure your future needs.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
            <Button size="lg" className="rounded-lg h-12 px-8 hover:scale-105">
              Our Services
            </Button>
            <Button size="lg" variant="secondary" className="rounded-lg h-12 px-8">
              Contact Sales
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
            <div className="flex -space-x-3">
              {clientAvatars.map((avatar, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full bg-gray-600 border-2 border-background-dark bg-cover bg-center"
                  style={{ backgroundImage: `url('${avatar.src}')` }}
                  role="img"
                  aria-label={avatar.alt}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-sm fill-current" size={16} />
                ))}
              </div>
              <span className="text-sm text-gray-400 font-medium">Trusted by 500+ companies</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 w-full max-w-[600px] lg:max-w-none">
          <div className="relative w-full aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border-dark bg-card-dark">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfZkPhQNG7-LUZBCUlkZYfDZF1jIHMV5htnghjdcQVye8kAkeA0KxKTB1Pk-4NdttaidDDiegGc-Rv9BriepcXFIpqiqLAdXkYECoKAE1Uz4K85tUCEqqTu0oOS0JgBBNUvU-pFtZUClPB1qvoa7hjkh5KNcg_2myv3I0hX4t5OcWfDelcHwB9C9wPnENh6Fm3I4hxPtWAOGsJHOYf7Ehz5Ln-veU6YnrHy-w61BN85MSITfykXbhbDhJTnmrSk1hK0ZJm9Ml0SG0')`,
              }}
              role="img"
              aria-label="Abstract visualization of futuristic data network and cybersecurity interface"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
            
            {/* Status Card */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#111318]/80 backdrop-blur-md border border-border-dark rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">System Secure</p>
                <p className="text-gray-400 text-xs">No threats detected in last 24h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
