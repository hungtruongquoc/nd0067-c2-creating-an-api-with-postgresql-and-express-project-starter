"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachProductRoutes = void 0;
const Product_1 = require("../models/Product");
const verifyAuthToken_1 = __importDefault(require("../middlewares/verifyAuthToken"));
const productStore = new Product_1.Product();
const index = async (_req, _res) => {
    const products = await productStore.index();
    _res.status(200).send({
        status: "success",
        data: products
    });
};
const create = async (_req, _res) => {
    const product = _req.body;
    if (!product.name || !product.price) {
        return _res.status(400).send({
            status: "failure",
            message: "Missing name/price in request body"
        });
    }
    try {
        const newProduct = await productStore.create(product);
        _res.status(200).send({
            status: "success",
            data: newProduct
        });
    }
    catch (error) {
        _res.status(500).send({
            status: "error",
            message: error.message
        });
    }
};
const show = async (_req, _res) => {
    const productId = parseInt(_req.params.id);
    if (!productId) {
        return _res.status(400).send({
            status: "failure",
            message: "Please send productId in path params"
        });
    }
    try {
        const product = await productStore.show(productId);
        _res.status(200).send({
            status: "success",
            data: product
        });
    }
    catch (error) {
        _res.status(500).send({
            status: "error",
            message: error.message
        });
    }
};
const attachProductRoutes = (app) => {
    app.get("/products", index);
    app.get("/products/:id", show);
    app.post("/products", verifyAuthToken_1.default, create);
};
exports.attachProductRoutes = attachProductRoutes;
