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
  it ('create a user should 401 by default', async () => {
    const response = await request.post('/users');
    expect(response.status).toBe(400);
  });
  it('create should return a user', async () => {
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
    // Get a list of users
    const users = await request.get('/users').set('Authorization', `Bearer ${login.body.token}`);
    expect(users.status).not.toBe(401);
    expect(users.status).toBe(200);
    expect(users.body.data).toBeDefined();
    expect(users.body.data.length).toBeGreaterThan(0);
    expect(parseInt(users.body.data[0].id, 10)).toBe(1);
    expect(users.body.data[0].email).not.toBe('');
    // Retrieves a single user
    const singleUser = await request.get('/users/1').set('Authorization', `Bearer ${login.body.token}`);
    expect(singleUser.status).not.toBe(401);
    expect(singleUser.status).toBe(200);
    expect(singleUser.body.data).toBeDefined();
    expect(parseInt(singleUser.body.data.id, 10)).toBe(1);
    expect(singleUser.body.data.email).not.toBe('');
  });
});
