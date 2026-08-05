import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.route.js'
import courseRoute from './routes/course.route.js'
import lectureRoute from './routes/lecture.route.js'
import { authenticate } from './middleware/auth.js'
const app = express()

app.use(express.json())
app.use(cors({ origin: 'https://lecture-scheduling-pi.vercel.app', credentials: true }))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/course', authenticate, courseRoute)
app.use('/api/lecture', authenticate, lectureRoute)

app.get('/health', (req, res) => {
  res.send('server running')
})

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`)
})
