import cors from 'cors'
import express from 'express'

import healthRouter from './routes/health.js'
import newsRouter from './routes/news.js'
import authRouter from './routes/auth.js'
import bookmarksRouter from './routes/bookmarks.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/news', newsRouter)
app.use('/api/auth', authRouter)
app.use('/api/bookmarks', bookmarksRouter)

app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`)
})
