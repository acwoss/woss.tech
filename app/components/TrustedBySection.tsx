import { Database, Cloud, Shield, Bot, Network } from "lucide-react"

const companies = [
  { name: "DataFlow", icon: Database },
  { name: "SkyNet", icon: Cloud },
  { name: "IronWall", icon: Shield },
  { name: "RoboCorp", icon: Bot },
  { name: "Nexus", icon: Network },
]

export function TrustedBySection() {
  return (
    <section className="py-10 border-y border-border-dark bg-[#0b0d11]">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-center text-gray-500 text-sm font-semibold uppercase tracking-widest mb-8">
          Trusted by industry leaders
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {companies.map((company) => {
            const Icon = company.icon
            return (
              <div key={company.name} className="flex items-center gap-2 text-xl font-bold text-white">
                <Icon className="w-6 h-6" />
                {company.name}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

