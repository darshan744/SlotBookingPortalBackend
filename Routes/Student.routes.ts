import express, { Router } from 'express';
// import {  slots} from '../Middlewares/StudentHandlers/'
import { bookSlot } from '../Middlewares/StudentHandlers/Book';
import { slots } from '../Middlewares/StudentHandlers/RetrieveSLots';
import { getEventResult } from '../Middlewares/StudentHandlers/EventResult';
import { upload } from '../Utils/MulterConfig';
import { fileUpload } from '../Middlewares/StudentHandlers/FileUpload';
import { fileDelete } from '../Middlewares/StudentHandlers/FileDelete';
const router : Router = express.Router();

router.post('/slots/:eventType/book',bookSlot);

router.get('/slots/:id/:eventType',slots);

router.get('/eventResult/:id',getEventResult);

router.route('/upload')
      .post(upload.single('file') , fileUpload)
      .delete(fileDelete)
export {router}