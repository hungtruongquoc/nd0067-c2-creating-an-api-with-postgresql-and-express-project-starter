import { User, UserType } from "../models/User";
import { Request, Response, Application } from "express";
import verifyAuthToken from "../middlewares/verifyAuthToken";
import { generateJWTToken } from "../utils/jwtToken";

const userStore = new User();

const index = async (_req: Request, _res: Response) => {
  const users = await userStore.index();
  _res.status(200).send({
    status: "success",
    data: users
  });
};

const login = async (_req: Request, _res: Response) => {
  const { email, password } = _req.body;
  if (!email || !password) {
    return _res.status(400).send({
      status: "failure",
      message: "Missing email/password in request body"
    });
  }
  const existingUserInDatabase = await userStore.authenticate(email, password);
  if (existingUserInDatabase && existingUserInDatabase.id) {
    const {id, email} = existingUserInDatabase;
    _res.status(200).send({
      status: "success",
      id: existingUserInDatabase.id,
      token: generateJWTToken({email})
    });
  } else {
    _res.status(401).send({
      status: "failure",
      message: "Invalid user credentials"
    });
  }
};

const create = async (_req: Request, _res: Response) => {
  const user: UserType = _req.body;
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
  } catch (error) {
    _res.status(500).send({
      status: "error",
      message: error.message
    });
  }
};

const signup = async (_req: Request, _res: Response) => {
  const user: UserType = _req.body;
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
    }
    _res.status(200).send({
      status: "success",
      data: userInfo,
      token: generateJWTToken({
        email: newUser.email
      })
    });
  } catch (error) {
    _res.status(500).send({
      status: "error",
      message: error.message
    });
  }
};

const show = async (_req: Request, _res: Response) => {
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
  } catch (error) {
    _res.status(500).send({
      status: "error",
      message: error.message
    });
  }
};

export const attachUserRoutes = (app: Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", create);
  app.post("/login", login);
};
