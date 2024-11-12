import express, { Router } from 'express';
import {bookSlot, slots} from '../Middlewares/Student.handlers'
const router : Router = express.Router();

router.get('/slots/:id/:eventType',slots);
router.post('/slots/:eventType/book',bookSlot);

export {router}