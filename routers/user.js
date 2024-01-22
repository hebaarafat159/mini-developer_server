import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import userController from '../controllers/userController.js'

let userRouter = express.Router();

// return all products list for a category
userRouter.post('/login',async (req,res)=>{
    // console.log("Start saving user data");
    await userController.saveUser(req, res);
})

export default userRouter;
