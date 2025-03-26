import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../auth/auth-options"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Debug logging
    console.log("Session data:", {
      exists: !!session,
      user: session?.user,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log(`Successfully fetched ${users.length} users`)
    return NextResponse.json(users, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error("Error in /api/users:", error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : error)
    
    return NextResponse.json(
      { error: "Failed to fetch users. Please try again later." },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } finally {
    await prisma.$disconnect()
  }
} 