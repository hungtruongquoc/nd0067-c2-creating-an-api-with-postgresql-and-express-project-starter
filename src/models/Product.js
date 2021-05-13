"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const database_1 = __importDefault(require("../database"));
class Product {
    async index() {
        try {
            const databaseConnection = await database_1.default.connect();
            const productTable = await databaseConnection.query("SELECT * FROM products");
            databaseConnection.release();
            return productTable.rows;
        }
        catch (error) {
            throw new Error(`Unable to get products ${error}`);
        }
    }
    async create(product) {
        try {
            const databaseConnection = await database_1.default.connect();
            const productsTable = await databaseConnection.query("INSERT INTO products(name, price) VALUES($1, $2) RETURNING id", [product.name, product.price]);
            databaseConnection.release();
            return {
                ...productsTable.rows[0],
                ...product
            };
        }
        catch (error) {
            throw new Error(`Unable to create product ${error}`);
        }
    }
    async show(id) {
        try {
            const databaseConnection = await database_1.default.connect();
            const productTable = await databaseConnection.query("SELECT * FROM products WHERE id=$1", [id]);
            databaseConnection.release();
            if (productTable.rowCount > 0) {
                return productTable.rows[0];
            }
            return null;
        }
        catch (error) {
            throw new Error(`Unable to get product ${error}`);
        }
    }
    async delete(id) {
        try {
            const databaseConnection = await database_1.default.connect();
            if (id) {
                await databaseConnection.query("DELETE FROM products WHERE id=$1", [
                    id
                ]);
            }
            else {
                await databaseConnection.query("DELETE FROM products");
            }
            databaseConnection.release();
        }
        catch (error) {
            throw new Error(`Unable to delete product ${error}`);
        }
    }
}
exports.Product = Product;
