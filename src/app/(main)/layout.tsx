<<<<<<< HEAD
import { BottomBar } from './_components/bottom'
import SiderBar from './_components/sider-bar'

type Props = {
  children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div className="flex max-md:flex-col h-screen w-screen overflow-x-hidden overflow-y-auto max-md:mb-80 max-md:overflow-auto">
      <SiderBar />
      <main className="w-full mb-[30px]">
        {children}
      </main>
      <BottomBar />
    </div>
  )
}
=======
import { BottomBar } from './_components/bottom'
import SiderBar from './_components/sider-bar'

type Props = {
  children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div className="flex max-md:flex-col h-screen w-screen overflow-x-hidden overflow-y-auto max-md:mb-80 max-md:overflow-auto">
      <SiderBar />
      <main className="w-full mb-[30px]">
        {children}
      </main>
      <BottomBar />
    </div>
  )
}
>>>>>>> 081bbfcb3162f1389d7117f2c30339ff4dd7cb8a
