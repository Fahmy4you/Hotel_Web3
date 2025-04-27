import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/role:
 *   get:
 *     summary: Get all roles
 *     description: Retrieve a list of all available hotels
 *     tags: [Hotel]
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   price:
 *                     type: number
 */
export async function GET() {
  const role = [
    { id: 'hotel-1', name: 'Luxury Hotel', location: 'New York', price: 250 },
    { id: 'hotel-2', name: 'Budget Inn', location: 'Los Angeles', price: 100 },
  ];

  return NextResponse.json(role);
}

/**
 * @swagger
 * /api/role:
 *   post:
 *     summary: Create a new hotel
 *     description: Add a new hotel to the database
 *     tags: [Hotel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Hotel created successfully
 */
export async function POST(request: Request) {
  // Implementation...
}