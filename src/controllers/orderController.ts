import { Order } from "../models/Order";
import { Application, Request, Response } from "express";
import verifyAuthToken from "../middlewares/verifyAuthToken";
const orderStore = new Order();

const fetchOrderByUser = async (_req: Request, _res: Response) => {
  const userId = parseInt(_req.params.id);
  if (!userId) {
    return _res.status(400).send({
      status: "failure",
      message: "Param order id not found"
    });
  }

  try {
    const orders = await orderStore.findByUserId(userId);
    _res.status(200).send({
      status: "success",
      data: orders
    });
  } catch (error) {
    _res.status(500).send({
      status: "error",
      message: error.message
    });
  }
};

export const attachOrderRoutes = (app: Application) => {
  app.get("/orders/user/:id", verifyAuthToken, fetchOrderByUser);
};
