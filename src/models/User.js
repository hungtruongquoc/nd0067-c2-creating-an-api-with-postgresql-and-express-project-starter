"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class User {
    async index() {
        try {
            const databaseConnection = await database_1.default.connect();
            const usersTable = await databaseConnection.query("SELECT id, firstname, lastname, email FROM users");
            databaseConnection.release();
            return usersTable.rows;
        }
        catch (error) {
            throw new Error(`Unable to get list of users ${error}`);
        }
    }
    async create(user) {
        try {
            const databaseConnection = await database_1.default.connect();
            const pepper = process.env.BCRYPT_PASSWORD;
            const saltRounds = parseInt(process.env.SALT_ROUNDS);
            const hashedPassword = await bcrypt_1.default.hash(user.password + pepper, saltRounds);
            const usersTable = await databaseConnection.query("INSERT INTO users(email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING id", [user.email, user.firstName, user.lastName, hashedPassword]);
            databaseConnection.release();
            return {
                ...usersTable.rows[0],
                ...user
            };
        }
        catch (error) {
            throw new Error(`Unable to create user ${error}`);
        }
    }
    async authenticate(email, password) {
        try {
            const connection = await database_1.default.connect();
            const pepper = process.env.BCRYPT_PASSWORD;
            const usersTable = await connection.query("SELECT * FROM users WHERE email=$1", [email]);
            const passwordToCompare = password + pepper;
            if (usersTable.rowCount > 0) {
                const user = usersTable.rows[0];
                const isPasswordSame = await bcrypt_1.default.compare(passwordToCompare, user.password);
                if (isPasswordSame) {
                    return user;
                }
            }
            return null;
        }
        catch (error) {
            throw new Error(`Unable to authenticate user ${error}`);
        }
    }
    async show(id) {
        const connection = await database_1.default.connect();
        const usersTable = await connection.query("SELECT id, firstname, lastname, email FROM users WHERE id=$1", [id]);
        if (usersTable.rowCount > 0) {
            return usersTable.rows[0];
        }
        return null;
    }
    async delete(id) {
        try {
            const databaseConnection = await database_1.default.connect();
            if (id) {
                await databaseConnection.query("DELETE FROM users WHERE id=$1", [id]);
            }
            else {
                await databaseConnection.query("DELETE FROM users");
            }
            databaseConnection.release();
        }
        catch (error) {
            throw new Error(`Unable to delete user ${error}`);
        }
    }
}
exports.User = User;
