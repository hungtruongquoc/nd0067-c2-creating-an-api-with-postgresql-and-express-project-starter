import express from "express";
import cors from 'cors';
import {attachProductRoutes} from "./controllers/productController";
import {attachUserRoutes} from "./controllers/userController";
import dotenv from "dotenv";
import {attachOrderRoutes} from "./controllers/orderController";

dotenv.config();

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(cors());
app.use(express.json());

// @ts-ignore
app.options('*', cors());
attachProductRoutes(app);
attachUserRoutes(app);
attachOrderRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
