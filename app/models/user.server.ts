import { User } from "@prisma/client";
import bcrypt from 'bcrypt';
import { prisma } from "~/utils/db.server";
import { getUserSession } from "./session.server";

export async function createUser(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      username, 
      passwordHash
    }
  })
}

export async function getUserByUsername(username: User["username"]) {
  return prisma.user.findUnique({ where: { username } });
}

export async function getLoggedUser(request: Request) {
  const session = getUserSession(request)
  
  
  const userId = (await session).get('userId')
  if (!userId || typeof userId !== 'string') return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    return user
  } catch (error) {
    return null
  }
}

export async function findUser(username: string) {
  return prisma.user.findFirst({ where: { username }})
}
