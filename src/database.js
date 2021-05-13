"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_TEST_DB, NODE_ENV, TEST_ENV } = process.env;
let database_to_connect = POSTGRES_DB;
if (NODE_ENV === TEST_ENV) {
    database_to_connect = POSTGRES_TEST_DB;
}
const client = new pg_1.Pool({
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: database_to_connect
});
exports.default = client;
