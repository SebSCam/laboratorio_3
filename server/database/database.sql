CREATE DATABASE test;
USE test
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '2021SlFj09';
CREATE TABLE users( id INT PRIMARY KEY, name VARCHAR(30) );
INSERT INTO users VALUES (1, 'Jose');
INSERT INTO users VALUES (2, 'Alex');
INSERT INTO users VALUES (3, 'Lola');