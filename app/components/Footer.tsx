import Link from "next/link"
import { Terminal } from "lucide-react"

const footerLinks = {
  company: [
    { name: "About Us", href: "#about" },
    { name: "Careers", href: "#" },
    { name: "Partners", href: "#" },
    { name: "News & Blog", href: "#" },
  ],
  services: [
    { name: "Cloud Architecture", href: "#services" },
    { name: "Cybersecurity", href: "#services" },
    { name: "Data Analytics", href: "#services" },
    { name: "Software Development", href: "#services" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Security", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0b0d11] border-t border-border-dark pt-16 pb-8 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="size-8 text-primary">
                <Terminal className="text-3xl" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight">woss.tech</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transforming businesses through intelligent technology solutions. We build the infrastructure your future needs.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2023 woss.tech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
