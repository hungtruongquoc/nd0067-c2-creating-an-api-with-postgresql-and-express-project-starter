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
}
