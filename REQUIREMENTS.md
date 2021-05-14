# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: `/products [GET]`
- Show: `/products/:id [GET]`
- Create [token required]: `/products [POST]`

#### Users
- Index [token required]: `/users [GET]`
- Show [token required]: `/users/:id [GET]`
- Create: `/users [POST]`

#### Orders
- Current Order by user (args: user id)[token required]: `/orders/user/:id`

## Data Shapes
#### Product
- id
- name
- price

Table:

```
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    price INTEGER NOT NULL
);
```

#### User
- id
- first_name
- last_name
- password
- email

Table:

```
CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

#### Orders
- id
- product_id
- product_qty
- user_id
- status of order (active or complete)

```
CREATE TABLE IF NOT EXISTS orders(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    status INTEGER NOT NULL DEFAULT 0,
    product_qty BIGINT NOT NULL DEFAULT 0,
    product_id BIGINT NOT NULL REFERENCES products(id)
);
```

```
CREATE TABLE IF NOT EXISTS order_details(
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id),
    qty BIGINT NOT NULL DEFAULT 0
);
```
