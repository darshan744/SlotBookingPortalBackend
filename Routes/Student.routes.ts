import express, { Router } from 'express';
import {slots} from '../Middlewares/Student.handlers'
const router : Router = express.Router();

router.get('/slots/:eventType',slots)

export {router}