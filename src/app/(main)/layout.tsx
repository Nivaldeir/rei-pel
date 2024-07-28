import SiderBar from './_components/sider-bar'

type Props = {
  children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen overflow-x-hidden overflow-y-auto max-md:mb-80 max-md:overflow-auto">
      {/* <MainSideBar />
      <MainBottomSiderbar /> */}
      <SiderBar />
      <main className="w-full">{children}</main>
    </div>
  )
}
