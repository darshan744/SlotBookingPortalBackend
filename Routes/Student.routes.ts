import express, { Router } from 'express';
import {bookSlot, getEventResult, slots} from '../Middlewares/Student.handlers'
const router : Router = express.Router();

router.post('/slots/:eventType/book',bookSlot);

router.get('/slots/:id/:eventType',slots);

router.get('/eventResult/:id',getEventResult);

export {router}