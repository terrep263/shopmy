'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '@/config/navigation'
import { BsGeoAltFill } from 'react-icons/bs'

export default function MainNavigation() {
  const pathname = usePathname()

  const visibleItems = navigation.filter((item) => item.visible)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <ul className="nav-menu">
      {visibleItems.map((item) => (
        <li key={item.href} className={isActive(item.href) ? 'active' : ''}>
          <Link href={item.href}>{item.label}</Link>
        </li>
      ))}
      <li>
        <Link href="/explore" className="mob-addlisting light">
          <BsGeoAltFill className="me-1" />
          Find Business
        </Link>
      </li>
    </ul>
  )
}
