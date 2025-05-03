"use client"
import { useWeb3Login } from "@/hooks/useWeb3Login"
import { IDRX_SEPOLIA } from "@/utils/AdressSC"
import { ConnectButton } from "@xellar/kit"
import { useEffect } from "react"
import { Address, erc20Abi, formatUnits } from "viem"
import { useAccount, useReadContract } from "wagmi"

const ConnectWalletButton = () => {
    const {isConnected, address} = useAccount();
    const {loginWallet} = useWeb3Login();

    useEffect(() => {
        if(isConnected && address) {
            loginWallet(address);
        }
    }, [isConnected, address, loginWallet])

  return (
    <>
        <ConnectButton.Custom>
            {({openConnectModal, isConnected, openProfileModal, account}) => {
                if(!isConnected) {
                    return (
                    <button className="contact-btn group" onClick={openConnectModal}>
                        <div className="inner">
                            <span>Connect Wallet</span>
                        </div>
                    </button>
                )} 

                return <ConnectedButton address={account?.address as Address} onClick={openProfileModal}/>
            }}
        </ConnectButton.Custom>
    </>
  )
}

const ConnectedButton = ({address, onClick}: {address: Address, onClick: () => void}) => {
    const {data} = useReadContract({
        address: IDRX_SEPOLIA,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as Address],
        query: {
            enabled: !!address
        }
    });

    const formatted = formatUnits(data ?? BigInt(0), 2);

    return (
        <button className="contact-btn group" onClick={onClick}>
            <div className="inner">
                <span>{Number(formatted).toLocaleString()} IDRX</span>
            </div>
        </button>
    )
}

export default ConnectWalletButton
