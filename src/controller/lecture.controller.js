import { prisma } from '../lib/Prisma.js'

const createLecture = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'not authorized' })
    }

    const { courseId } = req.params
    const { instructorId, lectureDate, name, description } = req.body

    if (!instructorId || !lectureDate || !name || !description) {
      return res.status(400).json({ error: 'all fileds required' })
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return res.status(404).json({ error: 'course not found' })
    }

    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
    })
    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      return res.status(400).json({ error: 'invalid instructor' })
    }

    const check = await prisma.lecture.findUnique({
      where: {
        instructorId_lectureDate: {
          instructorId: instructorId,
          lectureDate: new Date(lectureDate),
        },
      },
    })

    if (check) {
      return res
        .status(409)
        .json({ error: 'instructor already booked on this date' })
    }

    const lecture = await prisma.lecture.create({
      data: {
        courseId: courseId,
        instructorId: instructorId,
        lectureDate: new Date(lectureDate),
        name: name,
        description: description,
      },
    })

    res.status(201).json(lecture)
  } catch (err) {
    console.log('error in createLecture controller : ', err)
    res.status(500).json({ error: 'something went wrong' })
  }
}

const getMyLectures = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ error: 'not authorized' })
    }

    const lectures = await prisma.lecture.findMany({
      where: { instructorId: req.user.id },
      include: { course: true },
      orderBy: { lectureDate: 'asc' },
    })

    res.status(200).json(lectures)
  } catch (err) {
    console.log('error in getMyLectures controller : ', err)
    res.status(500).json({ error: 'something went wrong' })
  }
}

const deleteLecture = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'not authorized' })
    }

    const { id } = req.params

    const existing = await prisma.lecture.findUnique({ where: { id: id } })
    if (!existing) {
      return res.status(404).json({ error: 'lecture not found' })
    }

    await prisma.lecture.delete({ where: { id: id } })

    res.status(200).json({ message: 'lecture deleted' })
  } catch (err) {
    console.log('error in deleteLecture controller : ', err)
    res.status(500).json({ error: 'something went wrong' })
  }
}

const updateLecture = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'not authorized' })
    }

    const { id } = req.params
    const { instructorId, lectureDate, name, description } = req.body

    const existing = await prisma.lecture.findUnique({ where: { id: id } })
    if (!existing) {
      return res.status(404).json({ error: 'lecture not found' })
    }

    const update = {}

    if (instructorId) update.instructorId = instructorId
    if (lectureDate) update.lectureDate = new Date(lectureDate)
    if (name) update.name = name
    if (description) update.description = description

    const finalInstructorId = instructorId || existing.instructorId

    const finalLectureDate = lectureDate
      ? new Date(lectureDate)
      : existing.lectureDate

    if (instructorId || lectureDate) {
      const instructor = await prisma.user.findUnique({
        where: {
          id: finalInstructorId,
        },
      })

      if (!instructor || instructor.role !== 'INSTRUCTOR') {
        return res.status(400).json({
          error: 'invalid instructor',
        })
      }

      const check = await prisma.lecture.findUnique({
        where: {
          instructorId_lectureDate: {
            instructorId: finalInstructorId,
            lectureDate: finalLectureDate,
          },
        },
      })

      if (check && check.id !== existing.id) {
        return res.status(409).json({
          error: 'instructor already booked on this date',
        })
      }
    }

    const updated = await prisma.lecture.update({
      where: { id: id },
      data: update,
    })

    res.status(200).json({ message: 'lecture updated' })
  } catch (err) {
    console.log('error in updateLecture controller : ', err)
    res.status(500).json({ error: 'something went wrong' })
  }
}

const getAllInstructors = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'not authorized',
      })
    }

    const instructors = await prisma.user.findMany({
      where: {
        role: 'INSTRUCTOR',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    res.status(200).json(instructors)
  } catch (err) {
    console.log('error in getAllInstructors controller :', err)

    res.status(500).json({
      error: 'something went wrong',
    })
  }
}

export {
  createLecture,
  getMyLectures,
  deleteLecture,
  updateLecture,
  getAllInstructors,
}
