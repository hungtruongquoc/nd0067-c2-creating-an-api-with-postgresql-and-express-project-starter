DROP TABLE IF EXISTS orders;

CREATE TABLE IF NOT EXISTS orders(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    status INTEGER NOT NULL DEFAULT 0,
    product_qty BIGINT NOT NULL DEFAULT 0,
    product_id BIGINT NOT NULL REFERENCES products(id)
);
