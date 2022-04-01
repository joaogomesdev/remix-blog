import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

declare global { 
  var __prisma: PrismaClient | undefined 
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
  prisma.$connect()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
    global.__prisma.$connect()
  }
  prisma = global.__prisma
}

export { prisma }
