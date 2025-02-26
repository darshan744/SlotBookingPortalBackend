import express, { Router } from 'express'
import { getSlots , postSlots2 } from '../Middlewares/SuperAdminHandlers/Slots';
import { getAcceptedResponse } from '../Middlewares/SuperAdminHandlers/StaffsAvailability';
import { getResponseById } from '../Middlewares/SuperAdminHandlers/IndividualResponse';
import { acceptanceStatus } from '../Middlewares/SuperAdminHandlers/AcceptanceStatus';
import { requestAvailability } from '../Middlewares/SuperAdminHandlers/RequestAvailability';
import { getAllStaffs } from '../Middlewares/SuperAdminHandlers/GetStaffs';
import { createStaffs } from '../Middlewares/SuperAdminHandlers/insertStaffs';
import { createEvent } from '../Middlewares/SuperAdminHandlers/CreateEvent';
import {getBreaks, postBreaks} from "../Middlewares/SuperAdminHandlers/Breaks";
import {dashboard} from "../Middlewares/SuperAdminHandlers/Dashboard";
import { getQueries, postRemarksToQuery } from '../Middlewares/SuperAdminHandlers/Query';

const router : Router = express.Router();

router.post('/staffs/availability',requestAvailability)

router.post('/staffs',createStaffs)

router.get('/staffs',getAllStaffs )

router.get('/responses/accepted',getAcceptedResponse);

router.get('/responses/:id',getResponseById)

router.get('/responses',acceptanceStatus)

router.route("/slots").post(postSlots2).get(getSlots);

router.post('/events', createEvent)

router.route('/breaks').post(postBreaks).get(getBreaks)

router.get('/dashboard' , dashboard)

router.route('/query').get(getQueries).post(postRemarksToQuery);



export {router};
