import mongoose from "mongoose";
import { StudentModel } from "../Models/Student.model";
import { StaffModel } from "../Models/Staff.model";
import { Request, Response } from "express";
import { IStaff, IStudent } from "../Models/interfaces";
import {ResponseMessages , Role} from '../../Shared/Authenticate.enum'

// Augmenting the express-session module to include user information in the session





