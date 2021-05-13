"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachOrderRoutes = void 0;
const Order_1 = require("../models/Order");
const verifyAuthToken_1 = __importDefault(require("../middlewares/verifyAuthToken"));
const orderStore = new Order_1.Order();
const createOrder = async (_req, _res) => {
    const userId = parseInt(_req.params.userId);
    if (!userId) {
        return _res.status(400).send({
            status: "failure",
            message: "Please send userId in path params"
        });
    }
    try {
        const newOrder = await orderStore.create({
            user_id: userId
        });
        _res.status(200).send({
            status: "success",
            data: newOrder
        });
    }
    catch (error) {
        _res.status(500).send({
            status: "error",
            message: error.message
        });
    }
};
const fetchOrder = async (_req, _res) => {
    const userId = parseInt(_req.params.userId);
    if (!userId) {
        return _res.status(400).send({
            status: "failure",
            message: "Please send userId in path params"
        });
    }
    const status = Number(_req.query.status);
    try {
        const orders = await orderStore.showOrdersByUserId(userId, status);
        _res.status(200).send({
            status: "success",
            data: orders
        });
    }
    catch (error) {
        _res.status(500).send({
            status: "error",
            message: error.message
        });
    }
};
const markAsComplete = async (_req, _res) => {
    const orderId = parseInt(_req.params.orderId);
    if (!orderId) {
        return _res.status(400).send({
            status: "failure",
            message: "Please send orderId in path params"
        });
    }
    try {
        await orderStore.markOrderComplete(orderId);
        _res.status(200).send({
            status: "success"
        });
    }
    catch (error) {
        _res.status(500).send({
            status: "error",
            message: error.message
        });
    }
};
const attachOrderRoutes = (app) => {
    app.post("/orders/users/:userId", verifyAuthToken_1.default, createOrder);
    app.get("/orders/users/:userId", verifyAuthToken_1.default, fetchOrder);
    app.patch("/orders/:orderId/markAsComplete", verifyAuthToken_1.default, markAsComplete);
};
exports.attachOrderRoutes = attachOrderRoutes;
