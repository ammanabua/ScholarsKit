'use client'
import { ChevronDown, ChevronLeft, ChevronRight, FileText, MonitorDot, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'


const SideNav = () => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
    { link: '/dashboard', label: 'Home', icon: MonitorDot },
    { link: '/files', label: 'Files', icon: FileText, hasSubmenu: true },
    // { link: '/courses', label: 'Courses', icon: BookOpen, hasSubmenu: true },
    // { link: '/groups', label: 'Groups', icon: Users, hasSubmenu: true },
    { link: '/settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = () => {
    window.location.href = '/api/auth/logout'
    localStorage.clear()
    toast.info('Logging out...')
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex bg-slate-800 text-white flex-col h-screen sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className={`p-6 border-b border-slate-700 flex flex-col items-center ${isCollapsed ? 'space-y-2' : 'space-y-4'}`}>
          <div className="w-16 h-16 rounded-lg flex items-center justify-center">
            <Link href="/">
              <Image src='/logo-white.svg' width={15} height={15} alt="scholars kit logo" className="w-15 h-15" />
            </Link>
          </div>
          {!isCollapsed && <span className="text-xl font-semibold">ScholarsKit</span>}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-slate-700 hover:bg-slate-600 text-white rounded-full p-1.5 shadow-lg transition-colors z-10"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => (
            <div key={item.link}>
              <Link
                href={item.link}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg text-left transition-colors ${
                  pathname === item.link
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.hasSubmenu && <ChevronDown className="w-4 h-4" />}
              </Link>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors`}
            title={isCollapsed ? 'Log out' : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 text-white z-50 border-t border-slate-700">
        <nav className="flex justify-around items-center py-2 px-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                pathname === item.link
                  ? 'text-white bg-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </nav>
      </div>

      {/* Mobile bottom padding spacer - prevents content from being hidden behind bottom nav */}
      <div className="md:hidden h-20" />
    </>
  )
}

export default SideNav