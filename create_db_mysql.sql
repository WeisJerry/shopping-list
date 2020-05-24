#----------------------------------------------
# Script to create the groceries mysql database
#----------------------------------------------
#   Description:
#   This database keeps track of our 
#   grocery list.
#
#----------------------------------------------

# Stored procedure recreate_db (used to restart/reset the database)
# -----------------------------------------------------------------
USE GROCERIES;

Drop Table Selections;
Drop Table Groceries;
Drop Table Categories;

# General categories of classification (dairy, vegetables)
CREATE TABLE Categories (
    UserName varchar(100) NOT NULL,
    CategoryID int NOT NULL AUTO_INCREMENT,
    CATEGORYNAME varchar(255) NOT NULL,
    PRIMARY KEY (CategoryID)
);

# Groceries available to choose from (eggs, arrugula, butter)
CREATE TABLE Groceries (
    UserName varchar(100) NOT NULL,
    GroceryID int NOT NULL AUTO_INCREMENT,
	CategoryID int NOT NULL,
    GROCERYNAME varchar(255) NOT NULL,
    PRIMARY KEY (GroceryID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

# Groceries selected and their quantity (if not one)
CREATE TABLE Selections (
    UserName varchar(100) NOT NULL,
	QUANTITY int,
	GroceryID int NOT NULL,
    CategoryID int NOT NULL,
    FOREIGN KEY (GroceryID) REFERENCES Groceries(GroceryID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
	check (QUANTITY >= 0)
);

# End Stored procedure ---------------------------------------

# -----------------------------------------------------------------
# Stored procedure create auth db
# -----------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS AUTH;
USE AUTH;

CREATE TABLE users(
    USERNAME varchar(50) NOT NULL UNIQUE,
    PASSWORD varchar(255) NOT NULL,
    HINT varchar(100)
);
# ----------------------------------------------------------------


# -----------------------
# Test data for groceries
# -----------------------
# Do not include in the stored procedure
INSERT INTO Categories (CATEGORYNAME) values ("Dairy");
INSERT INTO Categories (CATEGORYNAME) values ("Produce");
INSERT INTO Categories (CATEGORYNAME) values ("Meat");

INSERT INTO Groceries (GROCERYNAME, CategoryId) values ("Eggs",1);
INSERT INTO Groceries (GROCERYNAME, CategoryId) values ("Bananas",2);
INSERT INTO Groceries (GROCERYNAME, CategoryId) values ("Arrugula",2);
INSERT INTO Groceries (GROCERYNAME, CategoryId) values ("Ground beef",3);
INSERT INTO Groceries (GROCERYNAME, CategoryId) values ("Hot dogs",3);

INSERT INTO Selections (QUANTITY, GroceryId, CategoryId) values (3,1,1);
INSERT INTO Selections (QUANTITY, GroceryId, CategoryId) values (2,2,2);
INSERT INTO Selections (QUANTITY, GroceryId, CategoryId) values (1,3,2);
INSERT INTO Selections (QUANTITY, GroceryId, CategoryId) values (1,4,3);
INSERT INTO Selections (QUANTITY, GroceryId, CategoryId) values (1,5,3);

# Test selection of all groceries and their quantity, ordered by category.
Select Groceries.*, Selections.QUANTITY, 
Categories.CategoryID, Categories.CATEGORYNAME  
   from Groceries 
   Inner Join Selections
   on Groceries.GroceryID = Selections.GroceryID
   Inner Join Categories
   on Groceries.CategoryID = Categories.CategoryID
   where QUANTITY > 0
   order by Groceries.CategoryID;
   