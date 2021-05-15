import jwt from "jsonwebtoken";

export interface UserPayloadInterface {
  email?: string;
}

export const generateJWTToken = (payload: UserPayloadInterface) => {
  const { TOKEN_SECRET } = process.env;
  return jwt.sign(payload, TOKEN_SECRET as string, {
    expiresIn: "2d"
  });
};

export const verifyJWTToken = (payload: string) => {
  const { TOKEN_SECRET } = process.env;
  return jwt.verify(payload, TOKEN_SECRET as string);
};
