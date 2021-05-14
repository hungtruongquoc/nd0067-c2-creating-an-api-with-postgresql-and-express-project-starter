import Client from "../database";

export interface ProductType {
  id?: number;
  name: string;
  price: number;
}

export class Product {
  async index(): Promise<ProductType[]> {
    try {
      const databaseConnection = await Client.connect();
      const productTable = await databaseConnection.query(
          "SELECT * FROM products"
      );
      databaseConnection.release();
      return productTable.rows;
    } catch (error) {
      throw new Error(`Unable to get products ${error}`);
    }
  }

  async create(product: ProductType): Promise<ProductType> {
    try {
      const databaseConnection = await Client.connect();
      const productsTable = await databaseConnection.query(
          "INSERT INTO products(name, price) VALUES($1, $2) RETURNING id",
          [product.name, product.price]
      );
      databaseConnection.release();
      return {
        ...productsTable.rows[0],
        ...product
      };
    } catch (error) {
      throw new Error(`Unable to create product ${error}`);
    }
  }

  async show(id: number): Promise<ProductType | null> {
    try {
      const databaseConnection = await Client.connect();
      const productTable = await databaseConnection.query(
          "SELECT * FROM products WHERE id=$1",
          [id]
      );
      databaseConnection.release();
      if (productTable.rowCount > 0) {
        return productTable.rows[0];
      }
      return null;
    } catch (error) {
      throw new Error(`Unable to get product ${error}`);
    }
  }
}
