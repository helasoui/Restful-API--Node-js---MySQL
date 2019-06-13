# Restful-API--Node-js---MySQL
Building Backend using Nodejs and Mysql Database

Hi I am héla SOUISSI and I am a Software Engineer 

Project Aim:

Building Restful API with 3 Edpoints one to return all products within their reviews and albums of images .
the second to return a certain product with its reviews and albums from MySQL database
another to insert new review in the SQL Database table called review.

Requirements:MySQL Workbench -NodeJS installed and Postman to test your APIs

Using NodeJS and MySQL database building a restful web api with the following endpoints

/products (returns a JSON array from database of products)
/products/:id (returns a JSON object of the specified product id)
/product/:id/reviews (with POST you create a new review)

products should have the following fields

- product id
- name
- description
- brand
- price


albums table should have the following fields

- image id
- product id
- path (filename, the image should be stored in disk not in db)

reviews table should have the following fields

- review id
- score (from 1 to 5 stars)
- description
- idproduct
