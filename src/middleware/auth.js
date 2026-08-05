import { verifyToken } from '../service/Auth.service.js'

export function authenticate(req, res, next) {
  const { token } = req.cookies

  if (!token) {
    return res.status(401).json({ error: 'not authenticated' })
  }

  try {
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ error: 'not authenticated' })
    }

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'invalid or expired token' })
  }
}
