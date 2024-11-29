import express, { Router } from 'express'
import { postSlots } from '../Middlewares/SuperAdminHandlers/CreateSlots';
import { getAcceptedResponse } from '../Middlewares/SuperAdminHandlers/StaffsAvailability';
import { getResponseById } from '../Middlewares/SuperAdminHandlers/IndividualResponse';
import { acceptanceStatus } from '../Middlewares/SuperAdminHandlers/AcceptanceStatus';
import { requestAvailability } from '../Middlewares/SuperAdminHandlers/RequestAvailability';
import { getAllStaffs } from '../Middlewares/SuperAdminHandlers/GetStaffs';
import { createStaffs } from '../Middlewares/SuperAdminHandlers/insertStaffs';

const router : Router = express.Router();

router.post('/staffs/availability',requestAvailability)

router.post('/staffs',createStaffs)

router.get('/staffs',getAllStaffs )

router.get('/responses/accepted',getAcceptedResponse);

router.get('/responses/:id',getResponseById)

router.get('/responses',acceptanceStatus)

router.post('/slots',postSlots);

export {router};
