DROP TABLE IF EXISTS order_details;

CREATE TABLE IF NOT EXISTS order_details(
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id),
    qty BIGINT NOT NULL DEFAULT 0
);
