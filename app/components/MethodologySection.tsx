import { Container } from "@/app/components/Container"
import { Section } from "@/app/components/Section"
import { CheckCircle2, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Análise e Diagnóstico",
    description:
      "Compreendemos profundamente os processos, desafios e objetivos da sua empresa através de reuniões estratégicas e análise detalhada.",
    color: "from-[#3b82f6]/20 to-[#2563eb]/10",
  },
  {
    number: "02",
    title: "Planejamento Estratégico",
    description:
      "Desenvolvemos um plano personalizado com soluções tecnológicas alinhadas às suas necessidades e orçamento, priorizando o que traz maior impacto.",
    color: "from-[#a855f7]/20 to-[#9333ea]/10",
  },
  {
    number: "03",
    title: "Implementação",
    description:
      "Executamos as soluções de forma ágil e organizada, mantendo você informado em cada etapa e garantindo mínima interrupção nas operações.",
    color: "from-[#10b981]/20 to-[#059669]/10",
  },
  {
    number: "04",
    title: "Suporte e Evolução",
    description:
      "Oferecemos suporte contínuo e acompanhamento para garantir que as soluções evoluam junto com o crescimento da sua empresa.",
    color: "from-[#f97316]/20 to-[#ea580c]/10",
  },
]

export function MethodologySection() {
  return (
    <Section id="como-trabalhamos" className="bg-[#171717] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
            <span className="text-sm font-medium text-white">Nossa Metodologia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Como{" "}
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Trabalhamos
            </span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Uma metodologia comprovada para transformar sua empresa através da tecnologia
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full"></div>
                </div>
              )}

              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-105">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <span className="text-6xl font-bold text-white/10">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {step.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Approach Card */}
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 sm:p-10 hover:bg-white/15 transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Nossa Abordagem
                </h3>
                <p className="text-white/80 leading-relaxed text-lg mb-6">
                  Trabalhamos de forma colaborativa, sempre priorizando a
                  comunicação clara e transparente. Acreditamos que a melhor
                  solução tecnológica é aquela que se adapta ao seu negócio, não
                  o contrário. Por isso, desenvolvemos parcerias de longo prazo
                  baseadas em confiança e resultados mensuráveis.
                </p>
                <div className="flex items-center text-white/90 font-medium group cursor-pointer">
                  <span>Conheça nossos cases de sucesso</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
