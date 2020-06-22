/* Remote postgresql db name: postgresql-concave-00665 

command sequence: (at command prompt)

heroku login
heroku pg:psql postgresql-concave-00665 --app weis-grocerylist
(navigate to sql script directory)
cat create_db_postgresql.sql | heroku pg:psql postgresql-concave-00665 --app weis-grocerylist

Get current credentials for DB:
heroku pg:credentials:url postgresql-concave-00665 --app weis-grocerylist

*/

CREATE DATABASE groceries; /*not needed for heroku */

CREATE TABLE Categories (
    UserName varchar(100) NOT NULL,
    CategoryID SERIAL PRIMARY KEY,
    CATEGORYNAME varchar(255) NOT NULL
);

CREATE TABLE Groceries (
    UserName varchar(100) NOT NULL,
    GroceryID SERIAL PRIMARY KEY,
	CategoryID int NOT NULL,
    GROCERYNAME varchar(255) NOT NULL,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

CREATE TABLE Selections (
    UserName varchar(100) NOT NULL,
	QUANTITY int,
	GroceryID int NOT NULL,
    CategoryID int NOT NULL,
    FOREIGN KEY (GroceryID) REFERENCES Groceries(GroceryID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
	check (QUANTITY >= 0)
);

CREATE TABLE users(
    USERNAME varchar(50) NOT NULL UNIQUE,
    PASSWORD varchar(255) NOT NULL,
    HINT varchar(100)
);

INSERT INTO users(USERNAME,PASSWORD,HINT) 
    VALUES('weis','32c7cb8f31f4740255594e899ba9c7','Old address');
