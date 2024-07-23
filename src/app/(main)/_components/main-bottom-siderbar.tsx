'use client'
import { usePathname } from 'next/navigation'
import {
  DashboardSidebar,
  DashboardSidebarMain,
  DashboardSidebarNav,
  DashboardSidebarNavLink,
  DashboardSidebarNavMain,
} from '@/components/globals/sidebar'
import { HomeIcon, ShoppingCart, UsersRound } from 'lucide-react'
import { UserDropdown } from './user-dropdown'

export function MainBottomSiderbar() {
  const pathnname = usePathname()
  const isActive = (path: string) => {
    return path === pathnname
  }
  return (
    <DashboardSidebar className="fixed bottom-0 left-0 right-0 backdrop-blur-sm z-30 text-white p-4 md:sr-only">
      <DashboardSidebarMain className="flex-col flex flex-grow ">
        <DashboardSidebarNav className="w-full">
          <DashboardSidebarNavMain className="flex w-full flex-row justify-between">
            <DashboardSidebarNavLink
              href="/"
              active={isActive('/')}
              className={`inline `}
            >
              <HomeIcon
                className={`w-5 h-5 text-center duration-700 ease-in-out`}
              />
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/clients"
              active={isActive('/clients')}
              className={`flex justify-center items-center bg-zinc-400`}
            >
              <UsersRound
                className={`w-5 h-5 text-center duration-700 ease-in-out $`}
              />
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/sales"
              active={isActive('/sales')}
              className={`flex justify-center items-center bg-zinc-400`}
            >
              <ShoppingCart
                className={`w-5 h-5 text-center duration-700 ease-in-out `}
              />
            </DashboardSidebarNavLink>
            <UserDropdown />
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>
      </DashboardSidebarMain>
    </DashboardSidebar>
  )
}
