import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Hotels
 *     description: Hotels management endpoints
 * 
 * /hotels:
 *   get:
 *     tags: [Hotels]
 *     summary: Retrieve list of hotels
 *     description: Get the list of all hotels with images and related details.
 *     responses:
 *       200:
 *         description: A list of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nama_hotel:
 *                     type: string
 *                   desk:
 *                     type: string
 *                   lokasi:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   user_id:
 *                     type: integer
 *       500:
 *         description: Error fetching hotels
 */

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany();
    return NextResponse.json(hotels);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching hotels' }, { status: 500 });
  }
}
