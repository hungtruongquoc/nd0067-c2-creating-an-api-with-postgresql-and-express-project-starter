const Promise = require("promise");

const productsData = require('../../data/products.js');

exports.seed = function (knex) {
  return knex('products').del()
      .then(() => {
        let productPromises = [];
        productsData.forEach((product) => {
          productPromises.push(createProduct(knex, product));
        });
        return Promise.all(productPromises);
      });
};

const createProduct = (knex, product) => {
  return knex('products').insert({
    name: product.name,
    price: product.price,
    thumb_link: product.thumb_link,
    large_link: product.large_link
  });
};
