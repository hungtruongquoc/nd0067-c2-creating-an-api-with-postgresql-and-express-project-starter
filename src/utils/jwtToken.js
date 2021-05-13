"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWTToken = exports.generateJWTToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWTToken = (payload) => {
    const { TOKEN_SECRET } = process.env;
    return jsonwebtoken_1.default.sign(payload, TOKEN_SECRET, {
        expiresIn: "2d"
    });
};
exports.generateJWTToken = generateJWTToken;
const verifyJWTToken = (payload) => {
    const { TOKEN_SECRET } = process.env;
    return jsonwebtoken_1.default.verify(payload, TOKEN_SECRET);
};
exports.verifyJWTToken = verifyJWTToken;
