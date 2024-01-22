import express, { Router } from "express";
import serverless from "serverless-http";
import cors from "cors";
import bodyParser from "body-parser";

// import categoryRouter from '../../routers/category.js'
// import productRouter from '../../routers/product.js'
// import userRouter from '../../routers/user.js'
// import listRouter from '../../routers/shoppingList.js'

// import cors from "cors";

// import mongoose, { Schema } from "mongoose";

// mongoose.connect(`${process.env.DATABASE_URL}`);

const api = express();

// api.use(
//   cors({
//     origin: "https://startling-mochi-356199.netlify.app", // Replace with your client's origin
//     credentials: true, // Enable credentials (cookies) in CORS
//   })
// );

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use(cors());
api.use(bodyParser.json());
// api.use("/api/", router);
// api.use("/api/categories", categoryRouter);
// api.use("/api/products", productRouter);
// api.use("/api/users", userRouter);
// api.use("/api/shoppingLists",listRouter);

export const handler = serverless(api);