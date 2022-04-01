import { PostRequest } from "app/routes/posts/post.types";
import { prisma } from "app/utils/db.server";


export function getPosts() {
  return prisma.post.findMany({
      take: 20,
      select: {
        id: true,
        title: true,
        created_at: true
      },
      orderBy: {created_at: 'desc'}
    })
} 

export function createPost({
  body,
  title,
  userId
}: PostRequest) {
  return prisma.post.create({ 
    data: {
      title,
      body, 
      userId
    }
  })
}

export function getPostById(id: string) {
  return prisma.post.findFirst({ 
    where: { id }
  })
}

export function deletePostById(id: string) {
  return prisma.post.delete({
    where: { id }
  })
}