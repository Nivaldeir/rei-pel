<<<<<<< HEAD
import { ReactNode, useEffect } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '../providers/modal-provider'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
type Props = {
  subheading?: string
  type?: 'sheet' | 'modal'
  children: ReactNode
  defaultOpen?: boolean
}

const CustomModal = ({ children, subheading, type = 'modal' }: Props) => {
  const { setClose, isOpen } = useModal()
  const handleClose = () => setClose()
  if (type === 'sheet') {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{subheading}</SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="px-10 py-4 max-md:p-3 ">
        <DialogHeader>
          <DialogTitle className="hidden">Modal</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal
=======
import { ReactNode, useEffect } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '../providers/modal-provider'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
type Props = {
  subheading?: string
  type?: 'sheet' | 'modal'
  children: ReactNode
  defaultOpen?: boolean
}

const CustomModal = ({ children, subheading, type = 'modal' }: Props) => {
  const { setClose, isOpen } = useModal()
  const handleClose = () => setClose()
  if (type === 'sheet') {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{subheading}</SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="px-10 py-4 max-md:p-3 ">
        <DialogHeader>
          <DialogTitle className="hidden">Modal</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal
>>>>>>> 081bbfcb3162f1389d7117f2c30339ff4dd7cb8a
