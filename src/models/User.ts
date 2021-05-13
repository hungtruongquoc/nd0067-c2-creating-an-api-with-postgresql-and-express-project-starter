import Client from "../database";
import bcrypt from 'bcrypt';

export interface UserType {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type UserPreview = Omit<UserType, "password">;

export class User {
  async index(): Promise<UserPreview[]> {
    try {
      const databaseConnection = await Client.connect();
      const usersTable = await databaseConnection.query(
          "SELECT id, first_name, last_name, email FROM users"
      );
      databaseConnection.release();
      return usersTable.rows;
    } catch (error) {
      throw new Error(`Unable to get list of users ${error}`);
    }
  }

  async create(user: UserType): Promise<UserPreview> {
    try {
      const databaseConnection = await Client.connect();
      const pepper = process.env.BCRYPT_PASSWORD;
      const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
      const hashedPassword = await bcrypt.hash(
          user.password + pepper,
          saltRounds
      );
      const usersTable = await databaseConnection.query(
          "INSERT INTO users(email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING id",
          [user.email, user.firstName, user.lastName, hashedPassword]
      );
      databaseConnection.release();
      return {
        ...usersTable.rows[0],
        ...user
      };
    } catch (error) {
      throw new Error(`Unable to create user ${error}`);
    }
  }

  async authenticate(
      email: string,
      password: string
  ): Promise<UserPreview | null> {
    try {
      const connection = await Client.connect();
      const pepper = process.env.BCRYPT_PASSWORD;
      const usersTable = await connection.query(
          "SELECT * FROM users WHERE email=$1",
          [email]
      );
      const passwordToCompare = password + pepper;
      if (usersTable.rowCount > 0) {
        const user = usersTable.rows[0] as UserType;
        const isPasswordSame = await bcrypt.compare(
            passwordToCompare,
            user.password
        );
        if (isPasswordSame) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw new Error(`Unable to authenticate user ${error}`);
    }
  }

  async show(id: number): Promise<UserPreview | null> {
    const connection = await Client.connect();
    const usersTable = await connection.query(
        "SELECT id, first_name, last_name, email FROM users WHERE id=$1",
        [id]
    );
    if (usersTable.rowCount > 0) {
      const {id, last_name, first_name, email} = usersTable.rows[0];
      return {id, firstName: first_name, lastName: last_name, email};
    }
    return null;
  }

  async delete(id?: number): Promise<void> {
    try {
      const databaseConnection = await Client.connect();
      if (id) {
        await databaseConnection.query("DELETE FROM users WHERE id=$1", [id]);
      }
      else {
        await databaseConnection.query("DELETE FROM users");
      }
      databaseConnection.release();
    } catch (error) {
      throw new Error(`Unable to delete user ${error}`);
    }
  }
}
