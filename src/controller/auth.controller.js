import { prisma } from '../lib/Prisma.js'
import { createToken } from '../service/Auth.service.js'
import bcrypt from 'bcryptjs'

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'all fields required' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: 'user already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role,
      },
    })

    const token = createToken({
      id: newUser.id,
      role: newUser.role,
      name: newUser.name,
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    })
  } catch (err) {
    console.log('error in signup controller ', err)
    res.status(500).json({ error: 'something went wrong' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'all fields required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' })
    }

    const isCorrect = await bcrypt.compare(password, user.password)
    if (!isCorrect) {
      return res.status(401).json({ error: 'invalid credentials' })
    }

    const token = createToken({ id: user.id, role: user.role, name: user.name })

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      id: user.id,
      name: user.name,
      role: user.role,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'something went wrong' })
  }
}

export { signup, login }
