import jwt from 'jsonwebtoken'

const exp = '1d'

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: exp,
  })
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export { createToken, verifyToken }
