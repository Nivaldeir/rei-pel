'use client'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
type ModalProviderProps = {
  children: ReactNode
}
type ModalData = {}
type ModalContextType = {
  data: ModalData
  isOpen: boolean
  setOpen: (modal: ReactNode, featchData?: () => Promise<any>) => void
  setClose: () => void
}

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: ReactNode, featchData?: () => Promise<any>) => {},
  setClose: () => {},
})

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<ModalData>({})
  const [showingModal, setShowingModal] = useState<ReactNode>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const setOpen = async (modal: ReactNode, featchData?: () => Promise<any>) => {
    if (modal) {
      if (featchData) {
        setData({ ...data, ...(await featchData()) } || {})
      }
      setShowingModal(modal)
      setIsOpen(true)
    }
  }

  const setClose = () => {
    setIsOpen(false)
    setData({})
  }
  if (!isMounted) return null
  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within the modal provider')
  }
  return context
}

export default ModalProvider
