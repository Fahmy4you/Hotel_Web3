'use client';
import {HeroUIProvider} from '@heroui/react'
import {ToastProvider} from "@heroui/toast";
import React from 'react';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  )
}