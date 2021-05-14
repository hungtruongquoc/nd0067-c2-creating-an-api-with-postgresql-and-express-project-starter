import {Order, OrderStatusTypes, OrderType} from "../models/Order";
import {Application, Request, Response} from "express";
import verifyAuthToken from "../middlewares/verifyAuthToken";

const orderStore = new Order();

const fetchOrderByUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (!userId) {
    return res.status(400).send({
      status: "failure",
      message: "Param order id not found"
    });
  }

  try {
    const orders = await orderStore.findByUserId(userId);
    res.status(200).send({
      status: "success",
      data: orders
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error.message
    });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {

  try {
    const order: OrderType = {
      status: OrderStatusTypes.STATUS_ACTIVE,
      user_id: parseInt(req.body.user_id)
    };
    const newOrder = await orderStore.create(order);
    res.status(200).send({
      status: "success",
      data: newOrder
    });
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}

const addProduct = async (req: Request, res: Response) => {
  const orderId: number = parseInt(req.params.id);
  const product_id: number = parseInt(req.body.product_id);
  const quantity: number = parseInt(req.body.qty);

  try {
    const addedProduct = await orderStore.addProduct(quantity, orderId, product_id);
    res.status(200).send({
      status: "success",
      data: addedProduct
    });
  } catch(err) {
    res.status(400);
    res.json(err);
  }
}

export const attachOrderRoutes = (app: Application) => {
  app.get("/orders/user/:id", verifyAuthToken, fetchOrderByUser);
  app.post("/orders", verifyAuthToken, create);
  app.patch("/orders/:id/products", verifyAuthToken, addProduct);
};
