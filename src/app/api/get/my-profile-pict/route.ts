import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   - name: Me
 *     description: Get info of the logged-in user endpoints
 * 
 * /get/my-profile-pict:
 *   get:
 *     tags: [Me]
 *     summary: Get the logged-in user's profile image file
 *     security:
 *       - Bearer: []
 *     description: Serve the actual profile image file for the logged-in user.
 *     responses:
 *       200:
 *         description: Successfully served profile image
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Profile image not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Token not provided" }, { status: 401 });
  }
  
  const secretKey = process.env.JWT_ACCSESS_TOKEN;
  if (!secretKey) {
    return NextResponse.json({ error: "JWT_SECRET is not defined in the environment variables." }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id: string };
    const userId = Number(decoded.id);

    // Get profile picture from database
    const profilePicture = await prisma.profilePict.findFirst({
      where: {
        user_id: userId
      }
    });

    if (!profilePicture) {
      return NextResponse.json({ error: "Profile picture not found" }, { status: 404 });
    }

    // Get the file path
    const imagePath = path.join(process.cwd(), 'public/uploads/profile_pict', profilePicture.images);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ error: "Image file not found" }, { status: 404 });
    }

    // Read the file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Determine content type based on file extension
    const fileExtension = path.extname(profilePicture.images).toLowerCase();
    let contentType = 'image/jpeg'; // Default
    
    switch (fileExtension) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Create response with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400' // Cache for 1 day
      }
    });
  } catch (error) {
    console.error('Error serving profile image:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Error serving profile image' }, { status: 500 });
  }
}