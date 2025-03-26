import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@example.com"
  const password = "admin123" // Change this to a secure password
  const name = "Admin User"

  try {
    const hashedPassword = await hash(password, 12)

    const admin = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        name,
        role: "ADMIN",
      },
    })

    console.log("Admin user created:", admin)
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 