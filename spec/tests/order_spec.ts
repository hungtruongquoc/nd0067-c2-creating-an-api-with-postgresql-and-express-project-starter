import {Order, OrderType} from "../../src/models/Order";
import supertest from "supertest";
import app from "../../src/server";

const request = supertest(app);
const store = new Order()

describe("Order Model", () => {
  it('should have an index method', () => {
    expect(store.findByUserId).toBeDefined();
  });
});

describe("Order Controller", () => {
  it ('show list of orders should return 401', async () => {
    const response = await request.get('/orders/user/1');
    expect(response.status).not.toBe(404);
  });
  it ('create endpoint should return 401 by default', async() => {
    const response = await request.post('/orders');
    expect(response.status).toBe(401);
  });
  it ('add product endpoint should return 401 by default', async() => {
    const response = await request.patch('/orders/1/products');
    expect(response.status).toBe(401);
  })
});
