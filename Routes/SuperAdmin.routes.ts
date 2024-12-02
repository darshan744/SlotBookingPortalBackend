import express, { Router } from 'express'
import { postSlots } from '../Middlewares/SuperAdminHandlers/CreateSlots';
import { getAcceptedResponse } from '../Middlewares/SuperAdminHandlers/StaffsAvailability';
import { getResponseById } from '../Middlewares/SuperAdminHandlers/IndividualResponse';
import { acceptanceStatus } from '../Middlewares/SuperAdminHandlers/AcceptanceStatus';
import { requestAvailability } from '../Middlewares/SuperAdminHandlers/RequestAvailability';
import { getAllStaffs } from '../Middlewares/SuperAdminHandlers/GetStaffs';
import { createStaffs } from '../Middlewares/SuperAdminHandlers/insertStaffs';
import { createEvent } from '../Middlewares/SuperAdminHandlers/CreateEvent';

const router : Router = express.Router();

//`/api/v1/SuperAdmin`

router.post('/staffs/availability',requestAvailability)

router.post('/staffs',createStaffs)

router.get('/staffs',getAllStaffs )

router.get('/responses/accepted',getAcceptedResponse);

router.get('/responses/:id',getResponseById)

router.get('/responses',acceptanceStatus)

router.post('/slots',postSlots);

router.post('/events', createEvent)

export {router};
