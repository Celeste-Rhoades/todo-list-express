// pulling all our dependcies and declairing a port
// Thisis used to import express from module to application. Require is part of node.js that allows you to import modules. In this case express modules
const express = require("express");
// defining the app variable to the function call to Express module
const app = express();
// imports the monogodb client objectfrom the mongodb client allowing you to connect to MOngodb database. require imports the mongo db module and provides functionality needed to interact with mongodb databases
const MongoClient = require("mongodb").MongoClient;
// declare port for listening. in this case  port 2121
const PORT = 2121;
// this imports the .env module. this is a zero dependency module( doesnt need external libraries or frameworks to function) that loads the enviroment variable from .env into process.env for managing configuration settings and secrets like API That you dont want in the source code
require("dotenv").config();

// let declares db but can be defined later. dbConnectionStr is a declared variable and assigned to the .env and holds a connection string to a database. The string includes the database type, host, port, database name, and authentication details.
let db,
  dbConnectionStr = process.env.DB_STRING,
  // It assigns to the string value todo that the app will interact with to dbname
  dbName = "todo";
//connects MongoDB database and takes 2 arguments. dbConnectionStr - is the connetion string(defined earlier has MongoDB servers address, database name and possibly auth details) { useUnifiedTopology: true } is becoming outdated replace with {useNewUrlParser: true} it doesnt directly replace it but recommended for connection setup
// .then this uses a promise to handle async connection process once connection happens the callback(.then())is exucuted. CLient parameter represents connection client which interacts with the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  client => {
    //this line logs indicating that the connection has been established successfully
    console.log(`Connected to ${dbName} Database`);
    //is a method used to get a reference to the databse. it can then be used preform operations on the database such as querying collections or inserting documens
    db = client.db(dbName);
  }
);
// set up middleware template engine
// sets view engine (combining fixed HTML with dynamic data.  displaying dynamic data on web pages by allowing you to embed variables, conditions, loops, and other logic directly within your HTML templates. )
// Express will look for an EJS file with the corresponding name in the views directory and render it as HTML.
app.set("view engine", "ejs");
// Express to serve static files from a directory named public
app.use(express.static("public"));
//part of Express's built-in middleware. extended: true - allows for objects and arrays to be encoded into URL-encoded format for a JSON-like experience
app.use(express.urlencoded({ extended: true }));
// another middleware(handles everything between request and response) Handles the JSONdata sent to the body of POST requests (found in RESTFul API and AJAX)
app.use(express.json());
// defines route handler for Express.js for HTTP GET requests made to the root URL(/) of app
// app.get -allows you to define how your app responds to different typs of hhtp requests (crud) to specific URLs
// where root handler is defined (located at the end of URl)
// async function  serves as a callbackfor route handler takes 2 params
// request - HTTP request. It contains information about the request, such as headers, query parameters, and the body of the request.
// response - formulate the HTTP response that will be sent back to the client. You can use methods on this object to send data back to the client,
app.get("/", async (request, response) => {
  // this retrieves all docs from "to-dos" collection and stores them in array
  // db.collection("todos")- this acceses collections within the database (mongodb, nonde.js)
  // .find() - create a query that will retrieve documents from collections(without any arguments, find() retrieves all documents in the collection.)
  // .toArray() - converts the results of the query(which is a cursor- meaning enables traveresal over records in database) into an array
  const todoItems = await db.collection("todos").find().toArray();
  // db.collection - accesses the 'to-do' collection in database
  const itemsLeft = await db
    .collection("todos")
    //called on 'to-dos' collectioin to count the docs that matcha specified filter. The filter { completed: false } specifies that only documents where the completed field is false should be counted.
    .countDocuments({ completed: false });
  // renders a view and sends the rendered html string to client.
  // index.ejs - is the template file you are rendering
  // object that contains local variable for the view.
  //
  response.render("index.ejs", { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});
// makes a post api request to addOne entry
app.post("/addTodo", (request, response) => {
  db.collection("todos")
    //go to collection and insert one object with key of thing and completed
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then(result => {
      console.log("Todo Added");
      //refresh users screen after post submission
      response.redirect("/");
    })
    .catch(error => console.error(error));
});
//makes an update request to the server to mark smething as complete
app.put("/markComplete", (request, response) => {
  //connect to data base
  db.collection("todos")
    .updateOne(
      //set item specified in request body to complete with the specified options
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then(result => {
      //send back results to show request was
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch(error => console.error(error));
});
//makes an update to the server to mark something incomplete
app.put("/markUnComplete", (request, response) => {
  db.collection("todos")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then(result => {
      console.log("Marked Complete");
      response.json("Marked Complete");
    })
    .catch(error => console.error(error));
});
//make a request to delete an item from data base
app.delete("/deleteItem", (request, response) => {
  //connect to the database and delete first item found that matches thing specified in json request body
  db.collection("todos")
    .deleteOne({ thing: request.body.itemFromJS })
    .then(result => {
      //send back to make sure app is complete
      console.log("Todo Deleted");
      response.json("Todo Deleted");
    })
    .catch(error => console.error(error));
});
//listen to server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
