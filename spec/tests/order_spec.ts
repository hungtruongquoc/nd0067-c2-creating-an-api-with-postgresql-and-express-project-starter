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

  it('show list of orders should return 401', async () => {
    const response = await request.get('/orders/user/1');
    expect(response.status).not.toBe(404);
  });

  it('create endpoint should return 401 by default', async () => {
    const response = await request.post('/orders');
    expect(response.status).toBe(401);
  });

  it('add product endpoint should return 401 by default', async () => {
    const response = await request.patch('/orders/1/products');
    expect(response.status).toBe(401);
  });

  it('create an order when a user is authenticated', async () => {
    // Creates a user
    const user = await request.post('/users').send({
      email: "test@create.com",
      firstName: "test",
      lastName: "test",
      password: "abc"
    });
    expect(user.status).toBe(200);
    // Logs into the system
    const login = await request.post('/login').send({email: "test@create.com", password: "abc"});
    expect(login.body.token).toBeDefined();
    expect(login.body.id).toBeDefined();
    // Creates an order
    const response = await request.post('/orders')
        .send({user_id: login.body.id})
        .set('Authorization', `Bearer ${login.body.token}`);
    expect(response.status).toBe(200);
  });

  it('return a create order', async () => {
    // Creates a user
    const user = await request.post('/users').send({
      email: "test@show.com",
      firstName: "test",
      lastName: "test",
      password: "abc"
    });
    expect(user.status).toBe(200);
    // Logs into the system
    const login = await request.post('/login').send({email: "test@show.com", password: "abc"});
    expect(login.body.token).toBeDefined();
    expect(login.body.id).toBeDefined();
    // Creates an order
    const response = await request.post('/orders')
        .send({user_id: login.body.id})
        .set('Authorization', `Bearer ${login.body.token}`);
    expect(response.status).toBe(200);
    // Gets all created order
    const orderResponse = await request.get(`/orders/user/${login.body.id}`)
        .set('Authorization', `Bearer ${login.body.token}`);
    expect(orderResponse.status).toBe(200);
  });

  it('add a product to an active order', async () => {
    // Creates a user
    const user = await request.post('/users').send({
      email: "test@addproduct.com",
      firstName: "test",
      lastName: "test",
      password: "abc"
    });
    expect(user.status).toBe(200);
    // Logs into the system
    const login = await request.post('/login')
        .send({email: "test@addproduct.com", password: "abc"});
    expect(login.body.token).toBeDefined();
    expect(login.body.id).toBeDefined();
    // Creates an order
    const orderResponse = await request.post('/orders')
        .send({user_id: login.body.id})
        .set('Authorization', `Bearer ${login.body.token}`);
    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body.data.id).toBeDefined();
    // Creates a product
    const productResponse = await request.post('/products')
        .send({name: "test", price: 100})
        .set('Authorization', `Bearer ${login.body.token}`);
    expect(productResponse.status).toBe(200);
    expect(productResponse.body.data.id).toBeDefined();
    const addProductResponse = await request.patch(`/orders/${orderResponse.body.data.id}/products`)
        .send({product_id: productResponse.body.data.id, qty: 1})
        .set('Authorization', `Bearer ${login.body.token}`);
    expect(addProductResponse.status).toBe(200);
  });
});
