'use client'
import { BookOpen, FileText, Home, Plus, Settings, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'


const SideNav = () => {
    const [activeNav, setActiveNav] = useState('home')

    const navItems = [
    { link: '/dashboard', label: 'Home', icon: Home },
    { link: '/files', label: 'Files', icon: FileText, hasSubmenu: true },
    { link: '/courses', label: 'Courses', icon: BookOpen, hasSubmenu: true },
    { link: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div>
        {/* Left Sidebar */}
        <div className="w-64 bg-slate-800 text-white flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700 m-auto flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Image src='/logo-white.svg' width={15} height={15} alt="scholars kit logo" className="w-15 h-15" />
                </div>
                <span className="text-xl font-semibold">ScholarsKit</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                <div key={item.link}>
                    <Link href={item.link}
                    onClick={() => setActiveNav(item.link)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                        activeNav === item.link
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    >
                    <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </div>
                    {item.hasSubmenu && <Plus className="w-4 h-4" />}
                    </Link>
                </div>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-slate-700">
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default SideNav