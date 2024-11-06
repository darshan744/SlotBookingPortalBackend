import express, { Router } from 'express'
const router : Router = express.Router();
import {requestAvailability,createStaffs,getAllStaffs
    ,getAcceptedResponse,getResponseById,getAllResponses,slots
} from '../Middlewares/SuperAdmin.middleware'


router.post('/staffs/availability',requestAvailability)
router.post('/staffs',createStaffs)
router.get('/staffs',getAllStaffs )
router.get('/responses/accepted',getAcceptedResponse);
router.get('/responses/:id',getResponseById)
router.get('/responses',getAllResponses)
router.post('/slots',slots);

export {router};
