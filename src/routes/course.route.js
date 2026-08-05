import { Router } from 'express'
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from '../controller/course.controller.js'

const route = Router()

route.post('/', createCourse)
route.get('/', getAllCourses)
route.get('/:id', getCourseById)
route.delete('/:id', deleteCourse)
route.put('/:id', updateCourse)

export default route
