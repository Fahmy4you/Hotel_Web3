"use client"
  
import React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, darkTheme } from "@xellar/kit";
import { configXellar } from "@/utils/configXellar";



const queryClient = new QueryClient();

export const XellarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={configXellar}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider theme={darkTheme}>{children}</XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
