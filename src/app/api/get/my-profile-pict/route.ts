import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/utils/verifyToken";
import fs from "fs";
import path from "path";

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
  const payload = verifyToken(token);
  if (payload instanceof NextResponse) return payload;

  try {
    const profilePicture = await prisma.profilePict.findFirst({
      where: {
        user_id: payload.id,
      },
    });

    if (!profilePicture) {
      return NextResponse.json(
        { error: "Profile picture not found" },
        { status: 404 }
      );
    }

    // Get the file path
    const imagePath = path.join(
      process.cwd(),
      "public/uploads/profile_pict",
      profilePicture.images
    );

    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: "Image file not found" },
        { status: 404 }
      );
    }

    // Read the file
    const imageBuffer = fs.readFileSync(imagePath);
    const fileExtension = path.extname(profilePicture.images).toLowerCase();
    let contentType = "image/jpeg"; // Default

    switch (fileExtension) {
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }

    // Create response with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
      },
    });
  } catch (error) {
    console.error("Error serving profile image:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Error serving profile image" },
      { status: 500 }
    );
  }
}
