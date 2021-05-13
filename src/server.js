"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productController_1 = require("./controllers/productController");
const userController_1 = require("./controllers/userController");
const dotenv_1 = __importDefault(require("dotenv"));
const orderController_1 = require("./controllers/orderController");
dotenv_1.default.config();
const app = express_1.default();
const address = "0.0.0.0:3000";
app.use(cors_1.default);
app.use(express_1.default.json());
// @ts-ignore
app.options('*', cors_1.default());
productController_1.attachProductRoutes(app);
userController_1.attachUserRoutes(app);
orderController_1.attachOrderRoutes(app);
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
