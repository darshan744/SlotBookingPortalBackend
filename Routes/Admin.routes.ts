import express, { Router } from 'express'
import {
    getSlotAvailability,
    getStudents,
    postAvailability,
    studentsMarks
} from '../Middlewares/Admin.handlers';
const router:Router = express.Router();

router.get('/getAvailability/:id' , getSlotAvailability);
router.post('/postAvailability/:id',postAvailability);
router.get('/students/:id',getStudents)
router.post('/studentMarks',studentsMarks)

export  {router};