import express, { Router } from 'express';
import {bookSlot, getEventResult, slots} from '../Middlewares/Student.handlers'
const router : Router = express.Router();

router.get('/slots/:id/:eventType',slots);
router.post('/slots/:eventType/book',bookSlot);
router.get('/eventResult/:id',getEventResult);

export {router}