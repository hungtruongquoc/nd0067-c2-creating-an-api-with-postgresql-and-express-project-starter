import Client from "../database";
import { QueryResult } from "pg";

export enum OrderStatusTypes {
  STATUS_ACTIVE,
  STATUS_COMPLETED
}

export type OrderDetailType = {
  id?: number;
  order_id: number;
  product_id: number;
  qty: number;
}

export type OrderType = {
  id?: number;
  user_id: number;
  status?: OrderStatusTypes;
  product_id?: number;
  product_qty?: number;
};

export type OrderWithDetail = {
  user_id: number;
  order_id: number;
  status?: OrderStatusTypes;
  product_id?: number;
  product_qty?: number;
}

export class Order {
  async findByUserId(id: number): Promise<OrderWithDetail[]> {
    const connection = await Client.connect();
    let ordersTable: QueryResult<OrderWithDetail>;
    const query = 'SELECT orders.user_id, order_details.order_id, orders.status, order_details.product_id, '
        + 'order_details.qty AS product_qty '
        + 'FROM orders LEFT JOIN order_details ON orders.id = order_details.id WHERE user_id = $1';
    ordersTable = await connection.query(query, [id]);
    connection.release();
    return ordersTable.rows;
  }

  async addProduct(quantity: number, orderId: number, productId: number): Promise<OrderDetailType> {
    let order: OrderType;

    try {
      const orderSql = 'SELECT * FROM orders WHERE id=$1';
      const conn = await Client.connect();
      const result = await conn.query(orderSql, [orderId]);
      order = result.rows[0];
      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    if (OrderStatusTypes.STATUS_ACTIVE !== order.status) {
      throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`)
    }

    try {
      const sql = 'INSERT INTO order_details (qty, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [quantity, orderId, productId]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
    }
  }

  async create(o: OrderType): Promise<OrderType> {
    try {
      const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [o.status, o.user_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add new order for ${o.user_id}. Error: ${err}`);
    }
  }
}
