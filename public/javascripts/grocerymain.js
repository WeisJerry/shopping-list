
/**
 * AJAX call to get content
 */
function showList(name) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("content").innerHTML =
        this.responseText;
    }
  };
  console.log('Sending GET');
  xhttp.open("GET", name, true);
  xhttp.send();
}

/**
 * Update the web page title
 */
function updateTitle() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var name = this.responseText;
      name = name.trim();
      if (name == "")
        name = "Weis";
      name += " Grocery List";
      document.getElementById("pagetitle").innerHTML =
        name;
    }
  };
  console.log('Sending GET');
  xhttp.open("GET", "username", true);
  xhttp.send();
}

/**
 * Add an item of the specified grocery type to the inventory,
 * and update the page.
 * 
 * @param {} groceryID 
 */
function add(groceryID) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      showList("edit");
    }
  };

  var json = JSON.stringify({
    groceryid: groceryID
  });
  console.log('Sending POST');
  xhttp.open("POST", "add", true);
  xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhttp.send(json);
}

/**
 * Remove an item of the specified grocery type to the inventory,
 * and update the page.
 * 
 * @param {} groceryID 
 */
function remove(groceryID) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      showList("edit");
    }
  };

  var json = JSON.stringify({
    groceryid: groceryID
  });
  console.log('Sending POST');
  xhttp.open("POST", "remove", true);
  xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhttp.send(json);
}

/**
 * Delete an item of the specified grocery type to the inventory,
 * and update the page.
 * 
 * @param {} groceryID 
 */
function deleteGrocery(groceryID) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      showList("manage");
    }
  };

  var json = JSON.stringify({
    groceryid: groceryID
  });
  console.log('Sending POST');
  xhttp.open("POST", "deletegrocery", true);
  xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhttp.send(json);
}

/**
 * Delete an entire category,
 * and update the page.
 * 
 * @param {} categoryID 

 */
function deleteCategory(categoryID) {
  var msg = "This will also remove all groceries in this category. Continue?";
  if (window.confirm(msg) == true) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        showList("manage");
      }
    };

    var json = JSON.stringify({
      categoryid: categoryID
    });
    console.log('Sending POST');
    xhttp.open("POST", "deletecategory", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  }
}

/**
 * Add a new grocery to this category
 * @param {*} categoryID 
 */
function newGrocery(categoryID) {
  var msg = "Enter a name for the new grocery.";
  var result = window.prompt(msg, "");
  if (result != null)
    result = result.trim();
  if (result != null && result != "") {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        showList("manage");
      }
    };

    var json = JSON.stringify({
      categoryid: categoryID,
      groceryname: result
    });
    console.log('Sending POST');
    xhttp.open("POST", "newgrocery", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  }
}

/**
 * Add a new category
 */
function newCategory() {
  var msg = "Enter a name for the new category.";
  var result = window.prompt(msg, "");
  if (result != null)
    result = result.trim();
  if (result != null && result != "") {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        showList("manage");
      }
    };

    var json = JSON.stringify({
      categoryname: result
    });
    console.log('Sending POST');
    xhttp.open("POST", "newcategory", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  }
}

/**
 * Clear out shopping list
 */
function restart() {
  var msg = "This will clear out the entire grocery list. Continue?";
  if (window.confirm(msg) == true) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        showList("manage");
      }
    };

    console.log('Sending POST');
    xhttp.open("POST", "restart", true);
    xhttp.send();
  }
}

/**
 * Run the following on page startup
 */
updateTitle();



