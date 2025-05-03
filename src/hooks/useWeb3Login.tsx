import { useSignMessage, useDisconnect } from 'wagmi'
import { useCallback } from 'react'

export const useWeb3Login = () => {
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect();

  const loginWallet = useCallback(async (address: string) => {
    const nonceRes = await fetch(`/api/auth/nonce?wallet_address=${address}`)
    // const { nonce } = await nonceRes.json()

    // const message = `Login to MydApp FK HOTEL WEB3 \nNonce : ${nonce}`
    // const signature = await signMessageAsync({ message })

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: address,
        // message,
        // signature
      })
    })

    if (!res.ok) {
        disconnect()
        return
    }

    const data = await res.json()
    return data
  }, [signMessageAsync])

  return { loginWallet }
}
