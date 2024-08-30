<<<<<<< HEAD
"use client"
import { HomeIcon, ShoppingCart, UserCheck, UsersRound } from "lucide-react"
import { useSession } from "next-auth/react";
import Link from "next/link"
import { User } from "../../../../types/next-auth";
import { usePathname } from "next/navigation";

export const BottomBar = () => {
  const url = usePathname();
  const { data: session } = useSession() as any as { data: { user: User }; status: string };
  const isActive = (path: string) => {
    if (!path) return false;
    return url === path;
  };

  return <aside className="fixed w-screen bottom-0  md:hidden">
    <nav className="mt-6 flex flex-1 items-start backdrop-blur-xl h-[50px]">
      <ul className="w-full h-full flex flex-row gap-1">
        <Link
          href="/"
          className={`flex w-full cursor-pointer justify-center rounded-lg p-[10px] hover:bg-slate-200  ${isActive("/") && "bg-slate-200"}`}
        >
          <div className="flex w-full items-center justify-center gap-3">
            <HomeIcon
              className={`w-5 h-5 text-center duration-700 ease-in-out `}
            />
          </div>
        </Link>
        <Link
          href="/clients"
          className={`flex w-full cursor-pointer justify-center rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/clients") && "bg-slate-200"}`}
        >
          <div className="flex w-full items-center justify-center gap-3">
            <UsersRound
              className={`w-5 h-5 text-center duration-700 ease-in-out`}
            />
          </div>
        </Link>
        <Link
          href="/sales"
          className={`flex w-full cursor-pointer justify-center rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/sales") && "bg-slate-200"}`}
        >
          <div className="flex w-full items-center justify-center gap-3">
            <ShoppingCart
              className={`w-5 h-5 text-center duration-700 ease-in-out`}
            />
          </div>
        </Link>
        {
          session?.user?.isAdmin &&
          <Link
            href="/users"
            className={`flex w-full cursor-pointer justify-center rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/users") && "bg-slate-200"}`}
          >
            <div className="flex w-full items-center justify-center gap-3">
              <UserCheck
                className={`w-5 h-5 text-center duration-700 ease-in-out  'mr-5 '
                }`}
              />
            </div>
          </Link>
        }
      </ul>
    </nav>
  </aside>
=======
"use client"
import { HomeIcon, ShoppingCart, UserCheck, UsersRound } from "lucide-react"
import { useSession } from "next-auth/react";
import Link from "next/link"
import { User } from "../../../../types/next-auth";
import { usePathname } from "next/navigation";

export const BottomBar = () => {
  const url = usePathname();
  const { data: session } = useSession() as any as { data: { user: User }; status: string };
  const isActive = (path: string) => {
    if (!path) return false;
    return url === path;
  };

  return <aside className="fixed w-screen bottom-0  md:hidden">
    <nav className="mt-6 flex flex-1 items-start bg-white">
      <ul className="w-full flex flex-row gap-1">
        <Link
          href="/"
          className={`flex w-full cursor-pointer justify-center rounded-lg p-[10px] hover:bg-slate-200  ${isActive("/") && "bg-slate-200/50"}`}
        >
          <div className="flex w-full items-center justify-center gap-3">
            <HomeIcon
              className={`w-5 h-5 text-center duration-700 ease-in-out `}
            />
          </div>
        </Link>
        <Link
          href="/clients"
          className={`flex w-full cursor-pointer justify-center rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/clients") && "bg-slate-200/50"}`}
        >
          <div className="flex w-full items-center justify-center gap-3">
            <UsersRound
              className={`w-5 h-5 text-center duration-700 ease-in-out`}
            />
          </div>
        </Link>
        <Link
          href="/sales"
          className={`flex w-full cursor-pointer justify-center rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/sales") && "bg-slate-200/50"}`}
        >
          <div className="flex w-full items-center justify-center gap-3">
            <ShoppingCart
              className={`w-5 h-5 text-center duration-700 ease-in-out`}
            />
          </div>
        </Link>
        {
          session?.user?.isAdmin &&
          <Link
            href="/users"
            className={`flex w-full cursor-pointer justify-center rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/users") && "bg-slate-200/50"}`}
          >
            <div className="flex w-full items-center justify-center gap-3">
              <UserCheck
                className={`w-5 h-5 text-center duration-700 ease-in-out  'mr-5 '
                }`}
              />
            </div>
          </Link>
        }
      </ul>
    </nav>
  </aside>
>>>>>>> 081bbfcb3162f1389d7117f2c30339ff4dd7cb8a
}