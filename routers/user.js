import 'dotenv/config'
import express from "express";
import userController from '../controllers/userController.js'

let userRouter = express.Router();

// return all products list for a category
userRouter.post('/login', async (req, res) => {
    // console.log("Start saving user data");
    await userController.saveUser(req, res);
})

userRouter.post('/sendMessage', async (req, res) => {
    await userController.sendMessage(req, res);
})

export default userRouter;
