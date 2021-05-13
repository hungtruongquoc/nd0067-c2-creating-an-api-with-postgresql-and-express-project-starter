import {Product, ProductType} from "../../src/models/Product";
import supertest from "supertest";
import app from '../../src/server';

const store = new Product()
const request = supertest(app);

describe("Product Model", () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });
  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });
});

describe("Product Controller", () => {
  it('index should not return 404', async () => {
    const response = await request.get('/products');
    expect(response.status).not.toBe(404);
  });

  it('show should not return 404', async () => {
    const response = await request.get('/products/1');
    expect(response.status).not.toBe(404);
  });

  it('create should return 401', async () => {
    const response = await request.post('/products');
    expect(response.status).toBe(401);
  });

  it('create should return a product', async () => {
    // Creates a user
    const user = await request.post('/users').send({
      email: "test@abc.com",
      firstName: "test",
      lastName: "test",
      password: "abc"
    });
    expect(user.status).toBe(200);
    // Logs into the system
    const login = await request.post('/login').send({email: "test@abc.com", password: "abc"});
    expect(login.body.token).toBeDefined();
    // Creates a product
    const response = await request.post('/products').send({name: "test", price: 100})
        .set('Authorization', `Bearer ${login.body.token}`);
    expect(response.status).not.toBe(401);
    // Retrieves the created product
    const product = await request.get('/products/1');
    expect(product.status).toBe(200);
    expect(product.body.data).toBeDefined();
    expect(parseInt(product.body.data.id, 10)).toBe(1);
  });
});
