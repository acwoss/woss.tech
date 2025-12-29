import {
  Card,
  CardContent,
} from "@/app/components/ui/card"
import { Cloud, Shield, BarChart3, Code } from "lucide-react"

const services = [
  {
    title: "Cloud Infrastructure",
    description: "Scalable, cost-effective, and secure cloud environments built on AWS, Azure, and Google Cloud.",
    icon: Cloud,
  },
  {
    title: "Cybersecurity Audits",
    description: "End-to-end security assessments, penetration testing, and compliance strategy to protect assets.",
    icon: Shield,
  },
  {
    title: "Data Analytics & AI",
    description: "Turn complex data sets into actionable business insights using advanced machine learning models.",
    icon: BarChart3,
  },
  {
    title: "Software Development",
    description: "Custom enterprise software solutions tailored to streamline your unique business workflows.",
    icon: Code,
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 px-6 relative" id="services">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">
              Our Expertise
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Comprehensive IT Solutions for Scalable Growth
            </h3>
          </div>
          <p className="text-gray-400 max-w-md text-base md:text-lg">
            We offer a full spectrum of services designed to modernize your legacy systems and secure your future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card
                key={service.title}
                className="group p-6 hover:border-primary/50 transition-all duration-300 hover:bg-[#222732]"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary text-3xl" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{service.title}</h4>
                <CardContent className="p-0">
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
