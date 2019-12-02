var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
// My port 
  port: 3306,
// Your username
  user: "root",
// Your password
  password: "Boblover91",
  database: "bamazon_db"
});

//the connection will log if connected, if not it will throw an error
connection.connect(function(err) {
  if (err) throw err;
  console.log("\nWelcome to BAmazon! Take a look at our products for sale below!\n");
allProducts();
});

function allProducts() {
    // query the database for all items for sale
    connection.query("SELECT * from products;", function(err, results, fields) {
        if (err) throw err;
        else {
        // console log all products
        console.table(results);
        
      }
      pickProduct();
     
    }
    
)}

function pickProduct() {
    inquirer
        .prompt([
        {
          name: "product",
          type: "input",
          message: "What is the id of the product you would like to buy?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many would you like to buy?"
        }
        ])
        .then(function(answer) {
            
            
            var product = answer.product;
            var quantity = answer.quantity;
            
            var queryProducts = "SELECT * FROM products WHERE ?";
            var cost 
            connection.query(queryProducts, {id: product}, 
              function(error, Response) {
                var productInfo = Response;
                if (error) throw error;
                if (quantity > productInfo.stock_quantity) {
                    console.log("I'm sorry we don't have enough in stock, choose a smaller quantity!"); 
                    allProducts()
                    
                }
                
                 else {
                   
                    if (quantity <= productInfo.stock_quantity) {
                        console.log("We have " + quantity + " " + productInfo.product_name + "s in stock for your order!")
                        console.log("Thank you for your order! Please wait while we process your order!"); 
                    } 
                    if (cost = quantity * productInfo.price) {
                        console.log("The total cost of your order is $" + cost + ".00"); 
                    }
                    
            var queryUpdate = "UPDATE products SET ? WHERE ?"
            connection.query(queryUpdate, [{stock_quantity: answer.quantity},{id: product}], function(error, response) {
                 if (error) throw error;
                 else  {    
                    console.log("Inventory has been updated!"); 
                                 
        //this will propmpt the user if they would like to make another purchase 
                   inquirer
                   .prompt({
                    name: 'next',
                    type: "input",
                    message: 'Would you like to place another order (Yes/No)?',
                    })
                    //if YES it will call the allProducts() function and if NO it will exit 
                  .then(function(answer) {
                      if (answer.next === "Yes") {
                          allProducts();
                      } else {
                        connection.end()
                        console.log("Thank you for shopping with us! Come back soon!")
                      }
                    
                     });
                   
                    
                     }
                 })
             }

                
         })
         
     })

        
 }