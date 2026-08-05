import { Router } from 'express'
import {
  createLecture,
  deleteLecture,
  getAllInstructors,
  getMyLectures,
  updateLecture,
} from '../controller/lecture.controller.js'

const route = Router()

route.post('/:courseId', createLecture)
route.put('/:id', updateLecture)
route.delete('/:id', deleteLecture)
route.get('/', getMyLectures)
route.get('/instructors' , getAllInstructors)

export default route
