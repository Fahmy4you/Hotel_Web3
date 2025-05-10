"use client"
import { useWeb3Logout } from "@/hooks/useLogoutApp"
import { useWeb3Login } from "@/hooks/useWeb3Login"
import { IDRX_ADDRESS } from "@/utils/constanta"
import { ConnectButton } from "@xellar/kit"
import { useEffect } from "react"
import { Address, erc20Abi, formatUnits } from "viem"
import { useAccount, useReadContract } from "wagmi"
import { formatNominal } from '../utils/Helper';
import { redirect } from "next/navigation"

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
                    <ConnectedButton address={account.address as Address} />
                ) : null;
                
            }}
        </ConnectButton.Custom>
    </>
  )
}

const ConnectedButton = ({address}: {address: Address}) => {
    const {data, error, isLoading} = useReadContract({
        address: IDRX_ADDRESS,
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

    const formatted = Number(formatUnits(data ?? BigInt(0), 2));

    return (
        <button className="contact-btn group" onClick={() => redirect('/dashboard')}>
            <div className="inner">
                <span>
                    {isLoading
                        ? "Loading..."
                        : `${formatNominal(Number(formatted))} IDRX`}
                </span>
            </div>
        </button>
    );
}

export default ConnectWalletButton
