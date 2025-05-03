import { useSignMessage, useDisconnect } from 'wagmi'
import { useCallback } from 'react'

export const useWeb3Login = () => {
  const { signMessageAsync } = useSignMessage()
  const { disconnectAsync } = useDisconnect();

  const loginWallet = useCallback(async (address: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: address,
      })
    })

    if (!res.ok) {
        await disconnectAsync()
        return
    }

    const data = await res.json()
    return data
  }, [signMessageAsync])

  return { loginWallet }
}
