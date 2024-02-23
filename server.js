import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import coursesRouter from './routers/courses.js'
import parentsRouter from './routers/parents.js'
import studentsRouter from './routers/students.js'
import classroomsRouter from './routers/classrooms.js'

const app = express();

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
  });
  
app.use(cors());
app.use(bodyParser.json());
app.use("/courses", coursesRouter);
app.use("/parents", parentsRouter);
app.use("/students", studentsRouter);
app.use("/classrooms", classroomsRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
})