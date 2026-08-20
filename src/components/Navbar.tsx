'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu, X,
  LayoutDashboard, MapPin, TrendingUp,
  Zap, SlidersHorizontal, BarChart2,
  Lightbulb, Info, LogIn, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SettingsPanel } from '@/components/SettingsPanel';

const navItems = [
  { name: 'Dashboard',   href: '/',                  icon: LayoutDashboard },
  { name: 'Stations',    href: '/stations',           icon: MapPin },
  { name: 'Historical',  href: '/historical',         icon: TrendingUp },
  { name: 'Predict',     href: '/predict',            icon: Zap },
  { name: 'Simulator',   href: '/simulator',          icon: SlidersHorizontal },
  { name: 'Performance', href: '/model-performance',  icon: BarChart2 },
  { name: 'Suggestions', href: '/recommendations',    icon: Lightbulb },
  { name: 'About',       href: '/about',              icon: Info },
];

const tabItems = [
  { name: 'Home',      href: '/',           icon: LayoutDashboard },
  { name: 'Stations',  href: '/stations',   icon: MapPin },
  { name: 'Predict',   href: '/predict',    icon: Zap },
  { name: 'History',   href: '/historical', icon: TrendingUp },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 bg-obsidian/80 backdrop-blur-xl border-b border-carbon transition-all duration-300',
          scrolled && 'shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-3 mr-4">
              <Image
                src="/icon.jpg"
                alt="Bengaluru AQI"
                width={32}
                height={32}
                className="rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] grayscale opacity-80"
                priority
              />
              <span className="font-mono text-lg text-eink font-bold tracking-tight hidden lg:block">
                BLR_AQI_SYS
              </span>
            </Link>

            {/* Desktop nav pills */}
            <div className="hidden sm:flex sm:items-center sm:gap-1 overflow-x-auto no-scrollbar flex-1 justify-start pr-4 mask-edges">
              {navItems.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all duration-200 whitespace-nowrap',
                    pathname === href
                      ? 'bg-eink text-obsidian font-semibold'
                      : 'text-steel hover:text-eink hover:bg-graphite'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  {name}
                </Link>
              ))}
            </div>

            {/* Right: settings + sign in */}
            <div className="hidden sm:flex items-center gap-2 ml-6 shrink-0">
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-2 rounded text-steel hover:text-eink hover:bg-graphite transition-colors btn-press"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded text-obsidian bg-eink hover:bg-white transition-colors btn-press"
              >
                <LogIn className="h-4 w-4" />
                AUTH
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center sm:hidden gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded text-steel hover:text-eink hover:bg-graphite transition-colors"
              >
                <span className="sr-only">Open menu</span>
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="sm:hidden bg-obsidian/95 backdrop-blur-xl border-b border-carbon absolute w-full shadow-2xl">
            <div className="pt-2 pb-4 space-y-1">
              {navItems.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors',
                    pathname === href
                      ? 'bg-graphite text-eink border-l-2 border-eink'
                      : 'text-steel hover:bg-graphite hover:text-eink border-l-2 border-transparent'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {name}
                </Link>
              ))}
              <div className="px-5 pt-4 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded font-semibold text-obsidian bg-eink transition-colors btn-press"
                >
                  <LogIn className="h-4 w-4" />
                  AUTH
                </Link>
                <button
                  onClick={() => { setIsOpen(false); setSettingsOpen(true); }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold text-eink bg-graphite border border-carbon transition-colors btn-press"
                >
                  <Settings className="h-4 w-4" />
                  CONF
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian/90 backdrop-blur-xl border-t border-carbon">
        <div className="flex justify-around items-center h-16 px-2">
          {tabItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 min-w-[52px] transition-all duration-200',
                pathname === href ? 'text-eink' : 'text-steel'
              )}
            >
              <div className={cn(
                'p-1.5 rounded transition-all duration-200',
                pathname === href ? 'bg-graphite' : ''
              )}>
                <Icon className={cn('h-5 w-5', pathname === href ? 'stroke-[2]' : 'stroke-[1.5]')} />
              </div>
              <span className={cn('text-[10px] font-mono leading-none tracking-tight', pathname === href ? 'font-bold' : 'font-medium')}>
                {name.toUpperCase()}
              </span>
            </Link>
          ))}

          <button
            onClick={() => setSettingsOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 min-w-[52px] text-steel hover:text-eink transition-all duration-200"
          >
            <div className="p-1.5 rounded">
              <Settings className="h-5 w-5 stroke-[1.5]" />
            </div>
            <span className="text-[10px] font-mono font-medium leading-none tracking-tight">CONF</span>
          </button>
        </div>
      </nav>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
