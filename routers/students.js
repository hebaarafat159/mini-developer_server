import 'dotenv/config'
import express from "express";
import studentController from '../controllers/studentController.js'

let studentRouter = express.Router();

studentRouter.post('/add', async (req, res) => {
    await studentController.saveStudent(req, res);
})

studentRouter.put('/:id', async (req, res) => {
    await studentController.updateStudent(req, res);
})

studentRouter.delete('/:id', async (req, res) => {
    await studentController.delete(req, res);
})

studentRouter.get('/', async (req, res) => {
    studentController.getStudents(req, res);
})

studentRouter.get('/:id', async (req, res) => {
    studentController.getStudent(req, res);
})

export default studentRouter;
