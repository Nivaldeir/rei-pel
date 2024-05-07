import { MainSideBar } from "./_components/main-siderbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <MainSideBar />
      <section className="w-full">
        <header className="px-6 py-3 space-y-6 border-b border-border w-full">
          <p className="ml-3 uppercase">Vendas</p>
        </header>
        <main className="p-4">{children}</main>
      </section>
    </div>
  );
}
