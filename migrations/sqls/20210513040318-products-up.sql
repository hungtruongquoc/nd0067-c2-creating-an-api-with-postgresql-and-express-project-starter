DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    price INTEGER NOT NULL,
    thumb_link VARCHAR(256),
    large_link VARCHAR(256)
);
