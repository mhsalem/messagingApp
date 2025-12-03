import { Request, Response } from "express";
import prisma from "../db";

type ReqWithUser = Request & { user?: { userId: string } };

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update user profile information (partial update - only provided fields are updated)
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *                 description: "New username (optional)"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *                 description: "New email address (optional)"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *                 description: "New phone number (optional)"
 *               profilePic:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/avatar.jpg"
 *                 description: "URL to profile picture (optional)"
 *               about:
 *                 type: string
 *                 example: "Software developer from San Francisco"
 *                 description: "User bio (optional)"
 *               isOnline:
 *                 type: boolean
 *                 example: true
 *                 description: "Online status (optional)"
 *               lastSeen:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T12:00:00Z"
 *                 description: "Last seen timestamp (optional)"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     profilePic:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     about:
 *                       type: string
 *                       example: "Software developer from San Francisco"
 *                     isOnline:
 *                       type: boolean
 *                       example: true
 *                     lastSeen:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T12:00:00Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00Z"
 *       400:
 *         description: Bad request - no data provided or duplicate field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No data provided for update"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update failed"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
export const updateProfile = async (req: ReqWithUser, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { 
      username, 
      phone, 
      email, 
      profilePic, 
      about, 
      isOnline,
      lastSeen 
    } = req.body;

    const updateData: any = {};

    if (username !== undefined) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (profilePic !== undefined) updateData.profilePic = profilePic;
    if (about !== undefined) updateData.about = about;
    if (isOnline !== undefined) updateData.isOnline = isOnline;
    if (lastSeen !== undefined) updateData.lastSeen = lastSeen;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        message: "No data provided for update" 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        profilePic: true,
        about: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true
      }
    });

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error: any) {
    console.error("Update error:", error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({
        message: "Duplicate field value",
        field: error.meta?.target?.[0] || 'unknown'
      });
    }
    
    return res.status(500).json({ 
      message: "Update failed", 
      error: error.message 
    });
  }
};