import { Container } from "@/app/components/Container"
import { Section } from "@/app/components/Section"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Zap, TrendingUp, Users, BarChart3, CheckCircle2 } from "lucide-react"

const saasSolutions = [
  {
    title: "CRM Personalizado",
    description:
      "Sistemas de gestão de relacionamento com cliente adaptados às necessidades específicas do seu negócio, aumentando vendas e melhorando o atendimento.",
    icon: Users,
    benefit: "Aumento de conversão em até 40%",
    gradient: "from-[#3b82f6]/20 via-[#2563eb]/10 to-transparent",
    iconGradient: "from-[#3b82f6] to-[#2563eb]",
    features: ["Gestão de leads", "Automação de vendas", "Relatórios detalhados"],
  },
  {
    title: "ERP em Nuvem",
    description:
      "Soluções de gestão empresarial integradas que centralizam processos financeiros, estoque, vendas e recursos humanos em uma única plataforma.",
    icon: BarChart3,
    benefit: "Redução de custos operacionais",
    gradient: "from-[#a855f7]/20 via-[#9333ea]/10 to-transparent",
    iconGradient: "from-[#a855f7] to-[#9333ea]",
    features: ["Controle financeiro", "Gestão de estoque", "RH integrado"],
  },
  {
    title: "Automação de Processos",
    description:
      "Elimine tarefas repetitivas e ganhe tempo para focar no que realmente importa. Automatizamos workflows e integrações entre sistemas.",
    icon: Zap,
    benefit: "Economia de até 20 horas/semana",
    gradient: "from-[#eab308]/20 via-[#f59e0b]/10 to-transparent",
    iconGradient: "from-[#eab308] to-[#f59e0b]",
    features: ["Workflows inteligentes", "Integrações API", "Notificações automáticas"],
  },
  {
    title: "Business Intelligence",
    description:
      "Dashboards e relatórios em tempo real que transformam dados em insights acionáveis para tomada de decisão estratégica.",
    icon: TrendingUp,
    benefit: "Decisões baseadas em dados",
    gradient: "from-[#10b981]/20 via-[#059669]/10 to-transparent",
    iconGradient: "from-[#10b981] to-[#059669]",
    features: ["Dashboards interativos", "Análise preditiva", "Relatórios em tempo real"],
  },
]

export function SaaSSection() {
  return (
    <Section id="solucoes-saas" className="bg-gradient-to-b from-white via-[#fafafa] to-white">
      <Container>
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-[#171717]/5 border border-[#171717]/10 mb-4">
            <span className="text-sm font-medium text-[#171717]">Soluções SaaS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#171717] mb-4">
            Plataformas que{" "}
            <span className="bg-gradient-to-r from-[#171717] to-[#171717]/70 bg-clip-text text-transparent">
              impulsionam resultados
            </span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#525252] max-w-2xl mx-auto">
            Tecnologia estratégica que transforma a forma como sua empresa opera
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {saasSolutions.map((solution) => {
            const Icon = solution.icon
            return (
              <Card
                key={solution.title}
                className="group relative overflow-hidden border-2 border-[#e5e5e5] bg-white hover:border-[#171717]/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <CardHeader className="relative z-10 pb-4">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${solution.iconGradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2 group-hover:text-[#171717] transition-colors">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  {/* Features */}
                  <div className="mb-6 space-y-3">
                    {solution.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-[#525252]">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Benefit badge */}
                  <div className="pt-6 border-t border-[#e5e5e5] group-hover:border-[#171717]/20 transition-colors">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#171717]/5 border border-[#171717]/10 group-hover:bg-[#171717]/10 group-hover:border-[#171717]/20 transition-all">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <p className="text-sm font-semibold text-[#171717]">
                        {solution.benefit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
