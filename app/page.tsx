import { Header } from "@/app/components/Header"
import { HeroSection } from "@/app/components/HeroSection"
import { TrustedBySection } from "@/app/components/TrustedBySection"
import { ServicesSection } from "@/app/components/ServicesSection"
import { ProductsSection } from "@/app/components/ProductsSection"
import { AboutSection } from "@/app/components/AboutSection"
import { TestimonialsSection } from "@/app/components/TestimonialsSection"
import { ContactSection } from "@/app/components/ContactSection"
import { Footer } from "@/app/components/Footer"

export default function Home() {
  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden min-h-screen">
      <Header />
      <main className="flex flex-col min-h-screen">
        <HeroSection />
        <TrustedBySection />
        <ServicesSection />
        <ProductsSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
