import express, { Router } from 'express';
// import {  slots} from '../Middlewares/StudentHandlers/'
import { bookSlot } from '../Middlewares/StudentHandlers/Book';
import { slots } from '../Middlewares/StudentHandlers/RetrieveSLots';
import { getEventResult } from '../Middlewares/StudentHandlers/EventResult';

const router : Router = express.Router();

router.post('/slots/:eventType/book',bookSlot);

router.get('/slots/:id/:eventType',slots);

router.get('/eventResult/:id',getEventResult);

export {router}