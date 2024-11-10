import express, { Router } from 'express'
import  {getSlotAvailability,postAvailability} from '../Middlewares/Admin.handlers';
const router:Router = express.Router();

router.get('/getAvailability/:id' , getSlotAvailability);
router.post('/postAvailability/:id',postAvailability);

export  {router};