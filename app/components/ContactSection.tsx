import { Card, CardContent } from "@/app/components/ui/card"
import { MapPin, Phone, Mail } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark to-[#0d1017]"></div>
      
      <div className="max-w-[1000px] mx-auto relative z-10">
        <Card className="border border-border-dark rounded-3xl overflow-hidden shadow-2xl p-8 lg:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Let's Build Something Great
          </h3>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Ready to start your digital transformation? Our team of experts is ready to help you navigate your next big project. Contact us today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Visit Us */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#111318] border border-border-dark hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MapPin className="text-primary" size={24} />
              </div>
              <h4 className="text-white font-bold mb-2">Visit Us</h4>
              <p className="text-gray-400 text-sm text-center">
                123 Innovation Blvd, Suite 400<br />
                San Francisco, CA 94103
              </p>
            </div>

            {/* Call Us */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#111318] border border-border-dark hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Phone className="text-primary" size={24} />
              </div>
              <h4 className="text-white font-bold mb-2">Call Us</h4>
              <p className="text-gray-400 text-sm text-center">
                +1 (555) 123-4567<br />
                Mon-Fri, 9am - 6pm PST
              </p>
            </div>

            {/* Email Us */}
            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#111318] border border-border-dark hover:border-primary transition-colors group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Mail className="text-primary" size={24} />
              </div>
              <h4 className="text-white font-bold mb-2">Email Us</h4>
              <p className="text-gray-400 text-sm text-center">
                hello@woss.tech<br />
                support@woss.tech
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
          </div>
        </Card>
      </div>
    </section>
  )
}

