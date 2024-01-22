import express, { Router } from "express";
import serverless from "serverless-http";
import cors from "cors";
import bodyParser from "body-parser";
import coursesRouter from '../../routers/courses.js'

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use(cors());
api.use(bodyParser.json());
api.use("/api/", router);
api.use("/api/courses", coursesRouter);

export const handler = serverless(api);