const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dBPath = path.join(__dirname, "todoApplication.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dBPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server is running on http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB ERROR:${error.message}`);
  }
};
initializeDBAndServer();

app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const statusQuery = `
        SELECT * FROM todo WHERE status  LIKE '${status}';`;
  const statusTodo = await db.all(statusQuery);
  response.send(statusTodo);
});

app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const priorityQuery = `
    SELECT * FROM todo WHERE priority LIKE '${priority}';`;
  const priorityArray = await db.all(priorityQuery);
  response.send(priorityArray);
});

app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const priorityStatusQuery = `
    SELECT * FROM todo WHERE priority LIKE '${priority}' AND status LIKE '${status}';`;
  const priorityStatusArray = await db.all(priorityStatusQuery);
  response.send(priorityStatusArray);
});

app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const searchQuery = `
    SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
  const searchArray = await db.all(searchQuery);
  response.send(searchArray);
});

//API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoIdQuery = `
    SELECT * FROM todo WHERE id = ${todoId};`;
  const todoIdArray = await db.get(todoIdQuery);
  response.send(todoIdArray);
});

//API 3
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const postQuery = `
    INSERT INTO todo(id,todo,priority,status) VALUES(${id},'${todo}','${priority}','${status}');`;
  await db.run(postQuery);
  response.send("Todo Successfully Added");
});

//API 5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `DELETE FROM todo WHERE id = ${todoId};`;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});
module.exports = app;
