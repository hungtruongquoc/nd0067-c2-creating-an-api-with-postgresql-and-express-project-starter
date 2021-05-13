"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachUserRoutes = void 0;
const User_1 = require("../models/User");
const verifyAuthToken_1 = __importDefault(require("../middlewares/verifyAuthToken"));
const jwtToken_1 = require("../utils/jwtToken");
const userStore = new User_1.User();
const index = async (_req, _res) => {
    const users = await userStore.index();
    _res.status(200).send({
        status: "success",
        data: users
    });
};
const login = async (_req, _res) => {
    const { email, password } = _req.body;
    if (!email || !password) {
        return _res.status(400).send({
            status: "failure",
            message: "Missing email/password in request body"
        });
    }
    const existingUserInDatabase = await userStore.authenticate(email, password);
    if (existingUserInDatabase) {
        _res.status(200).send({
            status: "success",
            token: jwtToken_1.generateJWTToken({
                email: email
            })
        });
    }
    else {
        _res.status(401).send({
            status: "failure",
            message: "Invalid user credentials"
        });
    }
};
const create = async (_req, _res) => {
    const user = _req.body;
    if (!user.email || !user.firstName || !user.lastName || !user.password) {
        return _res.status(400).send({
            status: "failure",
            message: "Missing email/firstname/lastname/password in request body"
        });
    }
    try {
        const newUser = await userStore.create(user);
        _res.status(200).send({
            status: "success",
            data: newUser
        });
    }
    catch (error) {
        _res.status(500).send({
            status: "error",
            message: error.message
        });
    }
};
const signup = async (_req, _res) => {
    const user = _req.body;
    if (!user.email || !user.firstName || !user.lastName || !user.password) {
        return _res.status(400).send({
            status: "failure",
            message: "Missing email/firstname/lastname/password in request body"
        });
    }
    try {
        const newUser = await userStore.create(user);
        const userInfo = {
            ...newUser,
            password: undefined
        };
        _res.status(200).send({
            status: "success",
            data: userInfo,
            token: jwtToken_1.generateJWTToken({
                email: newUser.email
            })
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
    const userId = parseInt(_req.params.id);
    if (!userId) {
        return _res.status(400).send({
            status: "failure",
            message: "Please send userId in path params"
        });
    }
    try {
        const user = await userStore.show(userId);
        _res.status(200).send({
            status: "success",
            data: user
        });
    }
    catch (error) {
        _res.status(500).send({
            status: "error",
            message: error.message
        });
    }
};
const attachUserRoutes = (app) => {
    app.get("/users", verifyAuthToken_1.default, index);
    app.get("/users/:id", verifyAuthToken_1.default, show);
    app.post("/users", verifyAuthToken_1.default, create);
    app.post("/users/login", login);
    app.post("/users/signup", signup);
};
exports.attachUserRoutes = attachUserRoutes;
