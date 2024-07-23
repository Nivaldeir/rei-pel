import { MainBottomSiderbar } from './_components/main-bottom-siderbar'
import { MainSideBar } from './_components/main-siderbar'

type Props = {
  children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen overflow-x-hidden overflow-y-auto max-md:mb-80 max-md:overflow-auto">
      <MainSideBar />
      <MainBottomSiderbar />
      <main className="w-[90%] max-md:w-full pb-[200px]">{children}</main>
      <div className="w-16 pb-[1400px] md:sr-only">Teste</div>
    </div>
  )
}
