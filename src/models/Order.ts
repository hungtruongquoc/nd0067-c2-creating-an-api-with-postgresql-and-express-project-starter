import Client from "../database";
import { QueryResult } from "pg";

export enum OrderStatusTypes {
  STATUS_ACTIVE,
  STATUS_COMPLETED
}

export type OrderType = {
  id?: number;
  user_id: number;
  status?: OrderStatusTypes;
  product_id?: number;
  product_qty?: number;
};

export class Order {
  async markOrderComplete(orderId: number) {
    try {
      const connection = await Client.connect();
      await connection.query("UPDATE orders SET status=1 WHERE id=$1;", [
        orderId
      ]);
      connection.release();
    } catch (error) {
      throw new Error(`Unable to mark order complete by user ${error}`);
    }
  }

  async findByUserId(id: number): Promise<OrderType[]> {
    const connection = await Client.connect();
    let ordersTable: QueryResult<OrderType>;
    ordersTable = await connection.query("SELECT * FROM orders WHERE user_id = $1;", [id]);
    connection.release();
    return ordersTable.rows;
  }

  async addProduct(quantity: number, orderId: number, productId: number): Promise<OrderType> {
    let order: OrderType;

    try {
      const orderSql = 'SELECT * FROM orders WHERE id=($1) RETURNING *'
      const conn = await Client.connect()
      const result = await conn.query(orderSql, [orderId])
      order = result.rows[0]
      conn.release()
    } catch (err) {
      throw new Error(`${err}`)
    }

    if (OrderStatusTypes.STATUS_ACTIVE !== order.status) {
      throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`)
    }

    try {
      const sql = 'INSERT INTO order_details (qty, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      const conn = await Client.connect()
      const result = await conn.query(sql, [quantity, orderId, productId])
      const order = result.rows[0]
      conn.release()
      return order
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
    }
  }

  async create(o: OrderType): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'
      const conn = await Client.connect()
      const result = await conn.query(sql, [o.status, o.user_id])
      const order = result.rows[0]
      conn.release()
      return order
    } catch (err) {
      throw new Error(`Could not add new order for ${o.user_id}. Error: ${err}`)
    }
  }
}
