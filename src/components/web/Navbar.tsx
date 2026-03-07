'use client'
import { motion } from "framer-motion";
import { useEffect,useState } from "react";
import Image from "next/image";
import { Menu, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [navbarScrolled, ] = useState(false);
    const router = useRouter();

    // Close mobile menu on desktop resize
    useEffect(() => {
    const onResize = () => {
        if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
    }, []);

    const navLinkClass = "text-slate-600 hover:text-blue-600 transition-colors font-medium";
    

  return (
    <>
    {/* NAV */}
    <nav
    className={[
        "fixed top-0 z-50 w-full border-b backdrop-blur",
        navbarScrolled ? "bg-white/95 shadow-sm border-slate-200" : "bg-white/80 border-slate-200",
    ].join(" ")}
    >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-2"
                aria-label="Scroll to top"
            >
                <span className="flex h-10 w-10 items-center justify-center">
                <Image src="/logo-black.svg" alt="Logo" width={16} height={16} className="h-10 w-10" />
                </span>
                <span className="text-xl font-bold">
                ScholarsKit
                </span>
            </button>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-8">
                <a href="#features" className={navLinkClass}>
                Features
                </a>
                <a href="#how-it-works" className={navLinkClass}>
                How It Works
                </a>
                <a href="#testimonials" className={navLinkClass}>
                Reviews
                </a>
                <a href="#pricing" className={navLinkClass}>
                Pricing
                </a>

                <motion.button
                onClick={() => router.push('/sign-in')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
                >
                Get Started Free
                </motion.button>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
                <button
                onClick={() => setMobileOpen((v) => !v)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Toggle mobile menu"
                >
                {mobileOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
            </div>
        </div>

        {/* Mobile menu */}
        <div className={mobileOpen ? "md:hidden border-t border-slate-200 bg-white" : "hidden"}>
            <div className="px-4 py-4 space-y-2">
            {[
                ["#features", "Features"],
                ["#how-it-works", "How It Works"],
                ["#testimonials", "Reviews"],
                ["#pricing", "Pricing"],
            ].map(([href, label]) => (
                <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
                >
                {label}
                </a>
            ))}
            <motion.button
                onClick={() => router.push('/sign-in')}
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
                Get Started Free
            </motion.button>
            </div>
        </div>
    </nav>
    </>
  )
}

export default Navbar