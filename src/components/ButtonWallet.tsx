"use client"

import { useWeb3Logout } from "@/hooks/useLogoutApp"
import { useWeb3Login } from "@/hooks/useWeb3Login"
import { IDRX_SEPOLIA } from "@/utils/AdressSC"
import { ConnectButton } from "@xellar/kit"
import { useEffect } from "react"
import { Address, erc20Abi, formatUnits } from "viem"
import { useAccount, useReadContract } from "wagmi"

const ButtonWallet = () => {
  const { isConnected, address } = useAccount()
  const { logoutWallet } = useWeb3Logout()

  // Ambil data balance selalu, tapi hanya aktif kalau isConnected true
  const { data: rawBalance } = useReadContract({
    address: IDRX_SEPOLIA,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    query: { enabled: isConnected && !!address }
  })

  // Format balance
  const formatted = formatUnits(rawBalance ?? BigInt(0), 2)

  // Sync login/logout ke Redux
  useEffect(() => {
    console.log("ppppp")
    if (!isConnected) {
        console.log(1111)
      logoutWallet()
    }
  }, [isConnected])

  return (
    <ConnectButton.Custom>
      {({ isConnected, openProfileModal }) => {
        if(isConnected) {
            return (
              <button
                className="bg-[#7828C8] w-full rounded-lg p-2"
                onClick={openProfileModal}
              >
                {Number(formatted).toLocaleString()} IDRX
              </button>
            )
        }
      }}
    </ConnectButton.Custom>
  )
}

export default ButtonWallet
