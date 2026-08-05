import { prisma } from '../lib/Prisma.js';

const createCourse = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'not authorized' });
    }

    const { name, level, description, imageUrl } = req.body;

    if (!name || !level || !description) {
      return res.status(400).json({ error: 'name, level and description required' });
    }

    const course = await prisma.course.create({
      data: { name, level, description, imageUrl }
    });

    res.status(201).json(course);

  } catch (err) {
    console.log("error in createCourse controller : " , err);
    res.status(500).json({ error: 'something went wrong' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'not authenticated' });
    }

    const courses = await prisma.course.findMany({
      include: { lectures: true }
    });

    res.status(200).json(courses);

  } catch (err) {
    console.log("error in getAllCourses controller : " , err);
    res.status(500).json({ error: 'something went wrong' });
  }
};

const getCourseById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'not authenticated' });
    }

    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: id },
      include: { lectures: { include: { instructor: true } } }
    });

    if (!course) {
      return res.status(404).json({ error: 'course not found' });
    }

    res.status(200).json(course);

  } catch (err) {
    console.log("error in getCourseById controller : " , err);
    res.status(500).json({ error: 'something went wrong' });
  }
};

const updateCourse = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'not authorized' });
    }

    const { id } = req.params;
    const { name, level, description, imageUrl } = req.body;

    const existing = await prisma.course.findUnique({ where: { id: id } });
    if (!existing) {
      return res.status(404).json({ error: 'course not found' });
    }

    const updated = await prisma.course.update({
      where: { id: id },
      data: { name, level, description, imageUrl }
    });

    res.status(200).json(updated);

  } catch (err) {
    console.log("error in updateCourse controller : " , err);
    res.status(500).json({ error: 'something went wrong' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'not authorized' });
    }

    const { id } = req.params;

    const existing = await prisma.course.findUnique({ where: { id: id } });
    if (!existing) {
      return res.status(404).json({ error: 'course not found' });
    }

    await prisma.course.delete({ where: { id: id } });

    res.status(200).json({ message: 'course deleted' });

  } catch (err) {
    console.log("error in deleteCourse controller : " , err);
    res.status(500).json({ error: 'something went wrong' });
  }
};

export {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};