'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary font-sans terminal-grid">
      {/* TopAppBar */}
      <header className="bg-surface border-b border-outline-variant fixed top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-8 h-16 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display text-2xl font-bold text-primary uppercase tracking-tighter">
              TERMINAL_CRMS
            </Link>
            <nav className="hidden md:flex gap-1">
              <NavItem href="/dashboard" label="Home" active={pathname === '/dashboard'} />
              <NavItem href="/tracker" label="Applications" active={pathname === '/tracker'} />
              <NavItem href="/analysis" label="Analysis Lab" active={pathname.startsWith('/analysis')} />
              <NavItem href="/profile" label="Master Profile" active={pathname === '/profile'} />
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-primary hover:bg-surface-variant transition-colors duration-100">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto">
        {children}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="bg-surface-container border-t border-outline-variant fixed bottom-0 w-full z-50 flex justify-around items-center h-14 md:hidden">
        <MobileNavItem href="/dashboard" icon="home" label="Home" active={pathname === '/dashboard'} />
        <MobileNavItem href="/tracker" icon="list_alt" label="Apps" active={pathname === '/tracker'} />
        <MobileNavItem href="/profile" icon="account_circle" label="Profile" active={pathname === '/profile'} />
        <MobileNavItem href="/analysis" icon="beaker" label="Lab" active={pathname === '/analysis'} />
      </nav>
    </div>
  )
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        'px-4 py-5 font-mono text-sm transition-colors duration-100 h-16 flex items-center',
        active 
          ? 'text-primary border-b border-primary font-bold bg-surface-variant/30' 
          : 'text-on-surface-variant hover:bg-surface-variant'
      )}
    >
      {label}
    </Link>
  )
}

function MobileNavItem({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        'flex flex-col items-center justify-center p-2 w-full transition-colors',
        active ? 'text-primary bg-surface-variant' : 'text-on-surface-variant hover:text-primary'
      )}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-mono text-[10px] uppercase mt-1">{label}</span>
    </Link>
  )
}
