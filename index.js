const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// const corsOptions = {
//   origin: ['http://localhost:5173', 'https://blog-react-swart-pi.vercel.app'],
//   credentials: true
// }                   

// app.use(cors(corsOptions))

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
}); 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/user', async (req, res) => {
  const user = await prisma.user.create({
    data: {
      userName: req.body.userName
    }
  })
  res.json(user)
})

app.post('/post', async (req, res) => {
  const post = await prisma.post.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      userId: parseInt(req.body.userId)
    }
  })
  res.json(post)
})

app.get('/feed', async (req, res) => {
  const post = await prisma.post.findMany({
    include: {
      user: true
    },
    orderBy: {
      updatedAt: 'desc'                     
    }
  })
  res.json(post)
})

app.get('/post/:id', async (req, res) => {
  const { id } = req.params
  if (!parseInt(id)) return res.status(404).json('Error: No ID found')
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: parseInt(id) }
  })  
  res.json(post)
})

app.patch('/post/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      title: req.body.title,
      content: req.body.content
    }
  })  
  res.json(post)
})

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  })
  res.json(post)
})

app.delete('/user/:id', async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.delete({
    where: { id: parseInt(id) }
  })
  res.json(user)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})