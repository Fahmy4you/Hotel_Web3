import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { prisma } from "@/utils/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const wallet_address = searchParams.get('wallet_address')
  
    if (!wallet_address || !isAddress(wallet_address)) {
      return NextResponse.json({ message: "Invalid wallet address" }, { status: 400 })
    }
  
    let user = await prisma.user.findUnique({ where: { wallet_address } })
  
    if (!user) {
      user = await prisma.user.create({ data: { wallet_address, role_id: 1 } })
    }
  
    // Generate random nonce
    const nonceValue = crypto.randomUUID()
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000) // 5 menit
  
    await prisma.nonce.create({
      data: {
        value: nonceValue,
        userId: user.id,
        expiredAt
      }
    })
  
    return NextResponse.json({ nonce: nonceValue })
  }
  