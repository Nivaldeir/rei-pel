"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authNextOptions } from "@/config/auth-config";
import { ChevronDown, ChevronLeft, CircleHelp, HomeIcon, LogOut, Package, Settings, ShoppingCart, UserCheck, UsersRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useState } from "react";
import { User } from "../../../../types/next-auth";

function SiderBar() {
  const url = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { data: session, status } = useSession() as any as { data: { user: User }; status: string };

  const handleMenuOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string) => {
    if (!path) return false;
    return url === path;
  };


  return (
    <aside
      className={`sticky top-0  max-md:hidden h-screen ${sidebarOpen ? "w-[260px]" : "w-[80px] items-center"} transition-width flex max-w-[260px] flex-col justify-between border-r-[1px] bg-white px-4 py-6 duration-300 ease-in-out`}
    >
      <div
        className="absolute -right-4 z-10 flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-lg border-[1px] bg-white transition-transform"
        onClick={handleMenuOpen}
        style={{ transition: "transform 0.3s ease-in-out" }}
      >
        <ChevronLeft
          size={16}
          className={`${sidebarOpen ? "rotate-0" : "rotate-180"}`}
        />
      </div>
      <div className="flex items-center gap-3 border-b-[1px] pb-4 transition-opacity duration-300 ease-in-out">
        <Avatar>
          <AvatarFallback> {session?.user.representative[0]}</AvatarFallback>
        </Avatar>
        {sidebarOpen && (
          <div className="flex flex-col">
            <p className="text-[10px]">Bem vindo(a)</p>
            <h1 className="font-bold text-[#063B89] text-sm truncate max-w-[100px]">
              {session?.user.representative}
            </h1>
          </div>
        )}
      </div>
      <nav className="mt-6 flex flex-1 items-start">
        <ul className="w-full flex flex-col gap-1">
          <Link
            href="/"
            className={`flex w-full cursor-pointer justify-between rounded-lg p-[10px] hover:bg-slate-200  ${isActive("/") && "bg-slate-200/50"}`}
          >
            <div className="flex w-full items-center gap-3">
              <HomeIcon
                className={`w-5 h-5 text-center duration-700 ease-in-out ${sidebarOpen && 'mr-5 '
                  }`}
              />
              {sidebarOpen && <span className="text-xs">Home</span>}
            </div>
          </Link>
          <Link
            href="/clients"
            className={`flex w-full cursor-pointer justify-between rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/clients") && "bg-slate-200/50"}`}
          >
            <div className="flex w-full items-center gap-3">
              <UsersRound
                className={`w-5 h-5 text-center duration-700 ease-in-out ${sidebarOpen && 'mr-5 '
                  }`}
              />
              {sidebarOpen && <span className="text-xs">Clientes</span>}
            </div>
          </Link>
          <Link
            href="/sales"
            className={`flex w-full cursor-pointer justify-between rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/sales") && "bg-slate-200/50"}`}
          >
            <div className="flex w-full items-center gap-3">
              <ShoppingCart
                className={`w-5 h-5 text-center duration-700 ease-in-out ${sidebarOpen && 'mr-5 '
                  }`}
              />
              {sidebarOpen && <span className="text-xs">Pedidos</span>}
            </div>
          </Link>
          {
            session?.user?.isAdmin &&
            <>
              <Link
                href="/users"
                className={`flex w-full cursor-pointer justify-between rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/users") && "bg-slate-200/50"}`}
              >
                <div className="flex w-full items-center gap-3">
                  <UserCheck
                    className={`w-5 h-5 text-center duration-700 ease-in-out ${sidebarOpen && 'mr-5 '
                      }`}
                  />
                  {sidebarOpen && <span className="text-xs">Usuarios</span>}
                </div>
              </Link>
              <Link
                href="/items"
                className={`flex w-full cursor-pointer justify-between rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/items") && "bg-slate-200/50"}`}
              >
                <div className="flex w-full items-center gap-3">
                  <Package
                    className={`w-5 h-5 text-center duration-700 ease-in-out ${sidebarOpen && 'mr-5 '
                      }`}
                  />
                  {sidebarOpen && <span className="text-xs">Produtos</span>}
                </div>
              </Link>
            </>
          }
        </ul>
      </nav>
      <div>
        <nav>
          <ul className="flex flex-col gap-1 justify-center">
            <Link
              href="/settings"
              className={`flex w-full cursor-pointer justify-c rounded-lg p-[10px] hover:bg-slate-200 ${isActive("/settings") && "bg-slate-200/50"}`}
            >
              <div className="flex w-full items-center gap-3">
                <Settings
                  className={`w-5 h-5 text-center duration-700 ease-in-out ${sidebarOpen && 'mr-5 '
                    }`}
                />
                {sidebarOpen && <span className="text-xs">Configurações</span>}
              </div>
            </Link>
            <Link
              href={"#"}
              onClick={() => signOut()}
              className={`flex w-full cursor-pointer justify-between rounded-lg p-[10px] hover:bg-red-100 ${sidebarOpen ? "opacity-1" : "opacity-0"} flex items-center gap-2`}
            >
              <div className="flex w-full items-center gap-3">

                <LogOut color="red" className={`w-5 h-5 text-center duration-700 ease-in-out ${sidebarOpen && 'mr-5 '
                  }`} />
                <span className="text-xs text-red-500">Sair</span>
              </div>
            </Link>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default memo(SiderBar);
