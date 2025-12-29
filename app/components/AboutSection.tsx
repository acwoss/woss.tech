import { CheckCircle2 } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-24 px-6 bg-[#0f1116] border-y border-border-dark" id="about">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left - Image */}
        <div className="lg:w-1/2 relative">
          <div className="relative rounded-2xl overflow-hidden border border-border-dark">
            <div
              className="w-full h-[400px] object-cover bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDjebiZ7oyIfwnLlUrJ9WMBJ95H-LpqEouU_zSVaExV2jjbD0GBoMmGMyb1VPTGHj5icDQPxJqJmG-oNbdAiTv9rzmDDublL-scv95auJ8Fz95ghU_r4Im1HNVSiHEhS_qz79g5G0Tvr8In4lnZxsKqnLinV9BxtddaxJdlSXTtNiM8z7L3CaWAY3ANeBZnXLv-17bMngRd4I5dve-dTVFXDgQPuL4isI4AwjB7jXvU6aC_JKGoUmpE2C0fr-fMIWCn-i5XQN8fSM')`,
              }}
              role="img"
              aria-label="Team of diverse IT professionals collaborating in a modern office with laptops"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
          </div>

          {/* Stats Card */}
          <div className="absolute -bottom-6 -right-6 bg-card-dark border border-border-dark p-6 rounded-xl shadow-xl hidden md:block">
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-black text-white">10+</p>
                <p className="text-sm text-gray-400">Years Experience</p>
              </div>
              <div className="w-px bg-border-dark"></div>
              <div>
                <p className="text-3xl font-black text-white">150%</p>
                <p className="text-sm text-gray-400">Avg ROI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Content */}
        <div className="lg:w-1/2">
          <h2 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
            About Us
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
            Innovation at Our Core. <br />
            Excellence in Delivery.
          </h3>
          <div className="space-y-4 text-gray-400 text-lg">
            <p>
              At woss.tech, we don't just fix computers; we architect the future of your business. Founded by a team of ex-Silicon Valley engineers, we bring enterprise-grade solutions to growing businesses.
            </p>
            <p>
              Our philosophy is simple: Technology should be an enabler, not a bottleneck. We partner with you to understand your core challenges and deploy solutions that drive measurable growth.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              "24/7 Support",
              "Certified Experts",
              "Agile Methodology",
              "Global Coverage",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

