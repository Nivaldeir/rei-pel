'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function useQueryParams<T = any>(): any {
  const searchParams = useSearchParams()
  const router = useRouter()
  const setParams = (name: string, value: any) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value.toString())
    router.push('?' + params.toString())
  }

  const getParam = (name: string) => {
    return searchParams?.get(name)
  }

  return { setParams, getParam, params: searchParams }
}
