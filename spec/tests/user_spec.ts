import {User, UserType} from "../../src/models/User";
import supertest from "supertest";
import app from "../../src/server";

const store = new User()
const request = supertest(app);

describe("User Model", () => {
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

describe("User Controller", () => {
  it ('show list of users should return 401', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });
  it ('show a specific user should return 401', async () => {
    const response = await request.get('/users/1');
    expect(response.status).toBe(401);
  });
  it ('create a user should not return 404 and 401', async () => {
    const response = await request.post('/users');
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(404);
  });
});
