"use client"
import { useWeb3Logout } from "@/hooks/useLogoutApp"
import { useWeb3Login } from "@/hooks/useWeb3Login"
import { IDRX_SEPOLIA } from "@/utils/AdressSC"
import { ConnectButton } from "@xellar/kit"
import { useEffect } from "react"
import { Address, erc20Abi, formatUnits } from "viem"
import { useAccount, useReadContract } from "wagmi"

const ConnectWalletButton = () => {
    const {isConnected, address} = useAccount();
    const {loginWallet} = useWeb3Login();
    const {logoutWallet} = useWeb3Logout();
    

    useEffect(() => {
        if(isConnected && address) {
            loginWallet(address);
        } else if (!isConnected) {
            logoutWallet();
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

                return account?.address ? (
                    <ConnectedButton address={account.address as Address} onClick={openProfileModal} />
                ) : null;
                
            }}
        </ConnectButton.Custom>
    </>
  )
}

const ConnectedButton = ({address, onClick}: {address: Address, onClick: () => void}) => {
    const {data, error, isLoading} = useReadContract({
        address: IDRX_SEPOLIA,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as Address],
        query: {
            enabled: !!address
        }
    });

    useEffect(() => {
        if (error) {
            console.error("Balance fetch error:", error);
        }
    }, [error]);

    const formatted = formatUnits(data ?? BigInt(0), 2);

    return (
        <button className="contact-btn group" onClick={onClick}>
            <div className="inner">
                <span>
                    {isLoading
                        ? "Loading..."
                        : `${Number(formatted).toLocaleString()} IDRX`}
                </span>
            </div>
        </button>
    );
}

export default ConnectWalletButton
