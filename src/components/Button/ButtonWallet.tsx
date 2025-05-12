"use client"

import { useWeb3Logout } from "@/hooks/useLogoutApp"
import { IDRX_ADDRESS } from "@/utils/constanta"
import { ConnectButton } from "@xellar/kit"
import { useEffect } from "react"
import { Address, erc20Abi, formatUnits } from "viem"
import { useAccount, useReadContract } from "wagmi"
import { formatNominal } from '@/utils/Helper';

const ButtonWallet = ({isCollapsed}: {isCollapsed: boolean}) => {
  const { isConnected, address } = useAccount()
  const { logoutWallet } = useWeb3Logout()

  // Ambil data balance selalu, tapi hanya aktif kalau isConnected true
  const { data, error, isLoading } = useReadContract({
    address: IDRX_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
    query: { enabled: isConnected && !!address }
  })

  useEffect(() => {
      if (error) {
          console.error("Balance fetch error:", error);
      }
  }, [error]);

  // Format balance
  const formatted = Number(formatUnits(data ?? BigInt(0), 2));

  // Sync login/logout ke Redux
  useEffect(() => {
    if (!isConnected) {
      logoutWallet()
    }
  }, [isConnected])

  return (
    <ConnectButton.Custom>
      {({ isConnected, openProfileModal }) => {
        if(isConnected) {
            return (
              <button
                className="bg-[#7828C8] w-full rounded-lg p-2 cursor-pointer"
                onClick={openProfileModal}
              >
                {isLoading ? 
                <span>Loading...</span> : 
                <span>
                    {isCollapsed
                      ? `${formatNominal(Number(formatted))} IDRX` 
                      : `${formatNominal(Number(formatted)).slice(0, 1)}`} 
                </span>}
                
              </button>
            )
        }
      }}
    </ConnectButton.Custom>
  )
}

export default ButtonWallet
