"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtToken_1 = require("../utils/jwtToken");
function verifyAuthToken(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(" ")[1];
            jwtToken_1.verifyJWTToken(token);
        }
        else {
            throw new Error("Missing token");
        }
        next();
    }
    catch (error) {
        res.status(401).send({
            status: "failure",
            message: error.message
        });
    }
}
exports.default = verifyAuthToken;
