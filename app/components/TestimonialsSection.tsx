import { Card, CardContent } from "@/app/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "woss.tech completely overhauled our legacy cloud infrastructure. The migration was seamless, and we've seen a 40% reduction in server costs.",
    author: "Sarah Jenkins",
    role: "CTO, FinEdge",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxfxX1qiPT-LW8Q4wcAt0Li-vafhVDZIcewyY3SXpR3sbKoxYjcGRCqLHC-VNl70s3T5T7YoI0ydJT3MbPUg5-tlPMxjWnO1ar-gtervKpulKBoGDbvGz2q_K0T5_0lu0jSmvPN9n487u0P_3sgbbn1B5G_PV0Kr75CZGVm93MLqKEf-rntNGn5HTq0BWjX2eE23EFQTy82UE0VeDqGtsArNqYqqAPvcNd5vPsL1UvVlE6b9P8TFG9940YR4pRlAe41yHxv--1KjI",
    alt: "Headshot of Sarah Jenkins",
  },
  {
    quote: "Their cybersecurity audit uncovered vulnerabilities we didn't know existed. The team's response was rapid and professional. Highly recommended.",
    author: "Mark Thompson",
    role: "Director of Ops, RetailGo",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ7qopZsoxef1Tp8oXuMVZZqV3XIL9EnjUoa2zJ28E7alWdRmCoINKcGK3_B3OMCTSOisivUDukWyAI5tGy3vUjGeyfrO1csu2pin_oFAg73zhgb3rGss947ugivhDbLY4qz2NusMq7_iPk-LxSQ9nPsYnOaXRDzSQaT9_LZyGOYffEFfb5gD972rIC54P3hILRPqRIx5iLFgrVEY-VOreqXaWu6jurGbzRkbriGjvnqCq0dUnimdpmeV_I8i13TWKkclukY7Xp5k",
    alt: "Headshot of Mark Thompson",
  },
  {
    quote: "The AI analytics dashboard they built has transformed how we view our customer data. We are finally making data-driven decisions.",
    author: "Elena Rodriguez",
    role: "VP Marketing, HealthPlus",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbewKuj4gCDmCxrVurAeVKA9EghQUc1naKT8HW4XcvVovjDrK6VLt96ydULLnvpF89P1j_jP8K_9uUUOKtzAY2k9AipJvxxGUdB73m0_rnnXKS0KltM0zcur_mbrc724gYmoBIggZ7g1l5J3y4NlsMF_DAZ0XR2K5uDwEgJfS8iEf5Bva1BEmQ_7m1DVlg4adXXcUim5Bo6bUt6bAsRcBjkATjinME_jt05cJBgvEWXclTOM7ajiNtwfuWQhvkdBufraPLhXMNcDI",
    alt: "Headshot of Elena Rodriguez",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6" id="testimonials">
      <div className="max-w-[1200px] mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          What Our Clients Say
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          We take pride in our long-term partnerships. Here is feedback from leaders who trust us with their infrastructure.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.author}
            className="p-8 flex flex-col relative"
          >
            <Quote className="text-6xl text-border-dark absolute top-6 right-6 opacity-50" />
            <p className="text-gray-300 mb-6 relative z-10 leading-relaxed">
              "{testimonial.quote}"
            </p>
            <div className="mt-auto flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url('${testimonial.avatar}')` }}
                role="img"
                aria-label={testimonial.alt}
              />
              <div>
                <p className="text-white font-bold">{testimonial.author}</p>
                <p className="text-primary text-sm">{testimonial.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

