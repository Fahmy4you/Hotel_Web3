'use client'
import { defaultConfig } from "@xellar/kit";
import { liskSepolia } from "viem/chains";
import { Config } from "wagmi";

const walletConnectProjectId = process.env.NEXT_PUBLIC_VITE_WALLET_CONNECT_PROJECT_ID ?? "";
const xellarAppId = process.env.NEXT_PUBLIC_XELLAR_APP_ID;

export const configXellar = defaultConfig({
  appName: "FK HOTEL WEB3",
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: "sandbox",
  chains: [liskSepolia],
}) as Config;