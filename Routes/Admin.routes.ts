import express, { Router } from "express";
import { getSlotAvailability } from "../Middlewares/AdminHandlers/GetAvailaibility";
import { postAvailability } from "../Middlewares/AdminHandlers/PostAvailability";
import { getStudents } from "../Middlewares/AdminHandlers/GetStudents";
import { studentsMarks } from "../Middlewares/AdminHandlers/PostStudentMarks";
import { findStudent } from "../Middlewares/AdminHandlers/IndividualStudent";

const router: Router = express.Router();

router.get("/getAvailability/:id", getSlotAvailability);

router.post("/postAvailability/:id", postAvailability);

router.get("/information/students", findStudent);

router.get("/students/:id", getStudents);

router.post("/studentMarks", studentsMarks);

export { router };