'use client'
import { usePathname } from 'next/navigation'
import {
  DashboardSidebar,
  DashboardSidebarFooter,
  DashboardSidebarMain,
  DashboardSidebarNav,
  DashboardSidebarNavHeader,
  DashboardSidebarNavHeaderTitle,
  DashboardSidebarNavLink,
  DashboardSidebarNavMain,
} from '@/components/globals/sidebar'
import {
  CircleArrowLeft,
  HomeIcon,
  ShoppingCart,
  UserCheck,
  UsersRound,
} from 'lucide-react'
import { useState } from 'react'
import { UserDropdown } from './user-dropdown'
import { useSession } from 'next-auth/react'

export function MainSideBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  console.log(session)
  const pathnname = usePathname()
  const isActive = (path: string) => {
    return path === pathnname
  }
  return (
    <DashboardSidebar
      className={`relative ${
        isOpen ? 'animate-menu-up w-[16rem]' : 'animate-menu-down w-[6rem]'
      } duration-700 ease-in-out
        max-md:sr-only
      `}
    >
      <div className="w-5 h-5">
        <CircleArrowLeft
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute right-[-0.7rem] top-3 cursor-pointer ${
            isOpen
              ? 'rotate-[180deg] hover:rotate-[0deg] '
              : 'rotate-[0deg] hover:rotate-[180deg] '
          }  duration-500`}
        />
      </div>
      <DashboardSidebarMain className="flex-col flex flex-grow ">
        <DashboardSidebarNav className=" ">
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink
              href="/"
              active={isActive('/')}
              className={`${!isOpen && 'flex justify-center items-center'}`}
            >
              <HomeIcon
                className={`w-5 h-5 text-center duration-700 ease-in-out ${
                  isOpen && 'mr-5 '
                }`}
              />
              {isOpen && 'Home'}
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/clients"
              active={isActive('/clients')}
              className={`${!isOpen && 'flex justify-center items-center'}`}
            >
              <UsersRound
                className={`w-5 h-5 text-center duration-700 ease-in-out ${
                  isOpen && 'mr-5 '
                }`}
              />
              {isOpen && 'Clientes'}
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/sales"
              active={isActive('/sales')}
              className={`${!isOpen && 'flex justify-center items-center'}`}
            >
              <ShoppingCart
                className={`w-5 h-5 text-center duration-700 ease-in-out ${
                  isOpen && 'mr-5 '
                }`}
              />
              {isOpen && 'Vendas'}
            </DashboardSidebarNavLink>
            {session?.user?.isAdmin && (
              <DashboardSidebarNavLink
                href="/users"
                active={isActive('/users')}
                className={`${!isOpen && 'flex justify-center items-center'}`}
              >
                <UserCheck
                  className={`w-5 h-5 text-center duration-700 ease-in-out ${
                    isOpen && 'mr-5 '
                  }`}
                />
                {isOpen && 'Usuarios'}
              </DashboardSidebarNavLink>
            )}
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>
        <DashboardSidebarNav className="mt-auto  ">
          <DashboardSidebarNavHeader>
            <DashboardSidebarNavHeaderTitle>
              Links extras
            </DashboardSidebarNavHeaderTitle>
          </DashboardSidebarNavHeader>
        </DashboardSidebarNav>
      </DashboardSidebarMain>
      <DashboardSidebarFooter>
        <UserDropdown />
      </DashboardSidebarFooter>
    </DashboardSidebar>
  )
}
