import { Router } from 'express'

const router = Router()

// Dùng để kiểm tra app trên điện thoại đã gọi được backend chưa
router.get('/', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

export default router
