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