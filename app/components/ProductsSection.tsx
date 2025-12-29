"use client"

import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Shield, Cloud, BarChart3, Network, ArrowRight } from "lucide-react"

const products = [
  {
    name: "CyberGuard 360",
    description: "Enterprise-grade threat detection and response platform. Monitor your entire digital estate in real-time with AI-driven security analysis.",
    icon: Shield,
    iconBg: "from-blue-600 to-blue-900",
    iconColor: "text-primary",
    hoverBorder: "hover:border-primary/50",
    hoverBg: "hover:bg-primary",
    hoverBorderColor: "hover:border-primary",
    hoverShadow: "group-hover:shadow-primary/25",
  },
  {
    name: "CloudScale Pro",
    description: "Automated infrastructure management for hybrid cloud environments. Scale resources dynamically and reduce operational costs by up to 40%.",
    icon: Cloud,
    iconBg: "from-purple-600 to-purple-900",
    iconColor: "text-purple-500",
    hoverBorder: "hover:border-purple-500/50",
    hoverBg: "hover:bg-purple-600",
    hoverBorderColor: "hover:border-purple-600",
    hoverShadow: "group-hover:shadow-purple-600/25",
  },
  {
    name: "DataSense AI",
    description: "Turn raw data into actionable business intelligence. Our no-code analytics platform empowers teams to visualize trends and predict outcomes.",
    icon: BarChart3,
    iconBg: "from-cyan-600 to-cyan-900",
    iconColor: "text-cyan-500",
    hoverBorder: "hover:border-cyan-500/50",
    hoverBg: "hover:bg-cyan-600",
    hoverBorderColor: "hover:border-cyan-600",
    hoverShadow: "group-hover:shadow-cyan-600/25",
  },
  {
    name: "ConnectAPI",
    description: "A unified gateway for all your microservices. Secure, manage, and monitor internal and external APIs from a single dashboard.",
    icon: Network,
    iconBg: "from-emerald-600 to-emerald-900",
    iconColor: "text-emerald-500",
    hoverBorder: "hover:border-emerald-500/50",
    hoverBg: "hover:bg-emerald-600",
    hoverBorderColor: "hover:border-emerald-600",
    hoverShadow: "group-hover:shadow-emerald-600/25",
  },
]

export function ProductsSection() {
  return (
    <section className="py-24 px-6 bg-[#0b0d11] border-t border-border-dark relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
              Our Products
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready-Made SaaS Platforms
            </h3>
          </div>
          <a
            href="#"
            className="group flex items-center gap-2 text-white font-bold text-sm hover:text-primary transition-colors"
          >
            View All Platforms
            <ArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => {
            const Icon = product.icon
            return (
              <Card
                key={product.name}
                className={`min-w-[260px] md:min-w-[280px] snap-center shrink-0 p-6 flex flex-col group ${product.hoverBorder} transition-all duration-300 relative overflow-hidden`}
              >
                {/* Background icon */}
                <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity`}>
                  <Icon className={`text-9xl ${product.iconColor}`} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.iconBg} flex items-center justify-center mb-6 shadow-lg ${product.hoverShadow}`}>
                    <Icon className="text-white text-3xl" />
                  </div>

                  {/* Title */}
                  <h4 className="text-2xl font-bold text-white mb-3">{product.name}</h4>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                    {product.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto pt-6 border-t border-border-dark/50">
                    <Button
                      variant="outline"
                      className={`w-full h-11 rounded-lg border border-border-dark bg-transparent ${product.hoverBg} ${product.hoverBorderColor} text-white font-semibold transition-all flex items-center justify-center gap-2 ${product.hoverShadow}`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

