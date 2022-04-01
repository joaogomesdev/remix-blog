import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  const jonh = await prisma.user.create({
    data: {
      username: `${Math.random().toString()}`,
      // Hash for password - twixrox
      passwordHash:
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  })  
  await Promise.all(
    getPosts().map(post => {
      const data = {userId: jonh.id, ...post}
      return prisma.post.create({ data })
    })
  )
}

seed()

function getPosts() {
  return [
    {
      title: 'useEffect vs useLayoutEffect',
      body: 'Both of these can be used to do basically the same thing, but they have slightly different use cases. So here are some rules for you to consider when deciding which React Hook to use. 📀'
    },
    {
      title: 'useEffect vs useLayoutEffect',
      body: 'Both of these can be used to do basically the same thing, but they have slightly different use cases. So here are some rules for you to consider when deciding which React Hook to use. 📀'
    },
    {
      title: 'How to use React Context effectively',
      body: 'In Application State Management with React, I talk about how using a mix of local state and React Context can help you manage state well in any React application. 📀'
    },
    {
      title: 'How I help you build better websites',
      body: 'This page describes some things to give you an idea of where my money comes from (how I keep my work sustainable) and where my money goes what youre supporting when you support me.📀'
    },
    {
      title: 'The State Initializer Pattern',
      body: 'This blog post involves React, but was written before Remix was launched. Learn how Remix drastically simplifies React applications from the post. 📀'
    },
  
  ]
}