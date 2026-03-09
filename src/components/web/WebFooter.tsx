'use client'
import { Twitter, Github, Linkedin, Instagram, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const WebFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center">
                  <Image src='/logo-black.svg' alt="Logo" width={32} height={32} className="h-10 w-10" />
                </div>
                <span className="text-xl font-semibold">
                Scholars<span className="bg-blue-600 bg-clip-text text-transparent">Kit</span>
                </span>
              </div>
              <p className="mb-4 text-sm text-slate-600">Empowering students worldwide with AI-powered learning tools.</p>
              <div className="flex gap-4">
                <Link href="/" className="text-slate-500 hover:text-slate-900" aria-label="Follow us on X">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="/" className="text-slate-500 hover:text-slate-900" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="/" className="text-slate-500 hover:text-slate-900" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="/" className="text-slate-500 hover:text-slate-900" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <FooterCol title="Product" links={[["Features", "#features"], ["Pricing", "#pricing"], ["API", "/"], ["Integrations", "/"]]} />
            <FooterCol title="Resources" links={[["Documentation", "/"], ["Help Center", "/"], ["Community", "/"], ["Blog", "/"]]} />
            <FooterCol title="Company" links={[["About", "/"], ["Careers", "/"], ["Privacy", "/"], ["Terms", "/"]]} />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row">
            <p className="text-sm text-slate-500">&copy; 2026 ScholarsKit AI <sup>&trade;</sup>. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Globe className="h-4 w-4" />
              English (US)
            </div>
          </div>
        </div>
    </footer>
  )
}

export default WebFooter

function FooterCol({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h5 className="mb-4 font-semibold text-slate-900">{title}</h5>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-slate-600 hover:text-slate-900 transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}