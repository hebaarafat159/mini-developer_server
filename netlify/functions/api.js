import express, { Router } from "express";
import serverless from "serverless-http";
import cors from "cors";
import bodyParser from "body-parser";
import coursesRouter from '../../routers/courses.js'
import parentsRouter from '../../routers/parents.js'
import studentsRouter from '../../routers/students.js'
import classroomsRouter from '../../routers/classrooms.js'
import userRouter from "../../routers/user.js";
const api = express();

const router = Router();
api.use(cors());
api.use(bodyParser.json());

router.get("/api/hello", (req, res) => res.send("Hello World!"));

api.use("/api/", router);
api.use("/api/courses", coursesRouter);
api.use("/api/parents", parentsRouter);
api.use("/api/students", studentsRouter);
api.use("/api/classrooms", classroomsRouter);
app.use("/api/users", userRouter);

export const handler = serverless(api);