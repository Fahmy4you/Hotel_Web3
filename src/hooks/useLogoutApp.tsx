"use client"
import { useSignMessage } from 'wagmi'
import { redirect } from 'next/navigation'
import { useCallback } from 'react'

export const useWeb3Logout = () => {
  const { signMessageAsync } = useSignMessage()

  const logoutWallet = useCallback(async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      redirect('/')
    }
  }, [signMessageAsync])

  return { logoutWallet }
}
