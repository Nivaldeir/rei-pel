import { cn } from "@/lib/utils";
import Link from "next/link";
import { GenericPropsDefault } from "../../../types/global";

export function DashboardSidebar({ children, className }: GenericPropsDefault) {
  return (
    <aside className={cn(["border-r border-border flex flex-col", className])}>
      {children}
    </aside>
  );
}
export function DashboardSidebarHeader({
  children,
  className,
}: GenericPropsDefault) {
  return (
    <header className={cn(["px-6 py-3 border-b border-border", className])}>
      {children}
    </header>
  );
}
export function DashboardSidebarMain({
  children,
  className,
}: GenericPropsDefault) {
  return <main className={cn(["px-3", className])}>{children}</main>;
}
export function DashboardSidebarNav({
  children,
  className,
}: GenericPropsDefault) {
  return <nav className={cn(["", className])}>{children}</nav>;
}
export function DashboardSidebarNavHeader({
  children,
  className,
}: GenericPropsDefault) {
  return <header className={cn(["", className])}>{children}</header>;
}

export function DashboardSidebarNavHeaderTitle({
  children,
  className,
}: GenericPropsDefault) {
  return (
    <div
      className={cn([
        "ml-3 text-xs uppercase text-muted-foreground",
        className,
      ])}
    >
      {children}
    </div>
  );
}

export function DashboardSidebarNavMain({
  children,
  className,
}: GenericPropsDefault) {
  return <main className={cn(["flex flex-col", className])}>{children}</main>;
}

type DashboardSidebarNavLinkProps = {
  href: string;
  active?: boolean;
};

export function DashboardSidebarNavLink({
  children,
  href,
  className,
  active,
}: GenericPropsDefault<DashboardSidebarNavLinkProps>) {
  return (
    <Link
      href={href}
      className={cn([
        "text-xs flex items-center px-3 py-2 rounded-md text-md",
        active && "bg-secondary ",
        className,
      ])}
    >
      {children}
    </Link>
  );
}
export function DashboardSidebarFooter({
  children,
  className,
}: GenericPropsDefault) {
  return (
    <footer className={cn(["p-6 mt-auto border-t border-border", className])}>
      {children}
    </footer>
  );
}
