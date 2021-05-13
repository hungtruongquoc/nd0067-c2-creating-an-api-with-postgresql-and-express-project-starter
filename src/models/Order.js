"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatusTypes = void 0;
const database_1 = __importDefault(require("../database"));
var OrderStatusTypes;
(function (OrderStatusTypes) {
    OrderStatusTypes[OrderStatusTypes["STATUS_ACTIVE"] = 0] = "STATUS_ACTIVE";
    OrderStatusTypes[OrderStatusTypes["STATUS_COMPLETED"] = 1] = "STATUS_COMPLETED";
})(OrderStatusTypes = exports.OrderStatusTypes || (exports.OrderStatusTypes = {}));
class Order {
    async showOrdersByUserId(userId, status) {
        try {
            const connection = await database_1.default.connect();
            let ordersTable;
            if (status || status === 0) {
                ordersTable = await connection.query("SELECT * FROM orders WHERE user_id=$1 AND status=$2;", [userId, status]);
            }
            else {
                ordersTable = await connection.query("SELECT * FROM orders WHERE user_id=$1;", [userId]);
            }
            connection.release();
            return ordersTable.rows;
        }
        catch (error) {
            throw new Error(`Unable to get list of orders by user ${error}`);
        }
    }
    async create(order) {
        try {
            const connection = await database_1.default.connect();
            const ordersTable = await connection.query("INSERT INTO orders(user_id) VALUES ($1) RETURNING id;", [order.user_id]);
            connection.release();
            return {
                ...ordersTable.rows[0],
                ...order
            };
        }
        catch (error) {
            throw new Error(`Unable to mark order complete by user ${error}`);
        }
    }
    async markOrderComplete(orderId) {
        try {
            const connection = await database_1.default.connect();
            await connection.query("UPDATE orders SET status=1 WHERE id=$1;", [
                orderId
            ]);
            connection.release();
        }
        catch (error) {
            throw new Error(`Unable to mark order complete by user ${error}`);
        }
    }
    async delete(id) {
        try {
            const databaseConnection = await database_1.default.connect();
            if (id) {
                await databaseConnection.query("DELETE FROM orders WHERE id=$1", [id]);
            }
            else {
                await databaseConnection.query("DELETE FROM orders");
            }
            databaseConnection.release();
        }
        catch (error) {
            throw new Error(`Unable to delete order ${error}`);
        }
    }
}
exports.Order = Order;
