import express, { Router } from "express";
import serverless from "serverless-http";
import cors from "cors";
import bodyParser from "body-parser";
import coursesRouter from '../routers/courses.js'
import parentsRouter from '../routers/parents.js'
import studentsRouter from '../routers/students.js'
import classroomsRouter from '../routers/classrooms.js'

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use(cors());
api.use(bodyParser.json());
api.use("/api/", router);
api.use("/api/courses", coursesRouter);
app.use("/api/parents", parentsRouter);
app.use("/api/students", studentsRouter);
app.use("/api/classrooms", classroomsRouter);

export const handler = serverless(api);