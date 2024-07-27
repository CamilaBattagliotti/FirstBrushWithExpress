import express, { json } from "express";
import db from "./database/db.json";
import { writeFileSync } from "jsonfile";

const PORT = 8080;
const app = express();

function validateId(request, response, next) {
  if (!request.body.id)
    return response.status(400).json({ message: "No me mandaste el ID capo" });

  next();
}

function addProperty(request, response, next) {
  request.user = "Jime";

  next();
}

app.use(json());
app.use(addProperty);

app.get("/api", (request: any, response) => {
  console.log(request.user); //request["user"] es lo mismo

  response.status(200).json(db.description);
});

app.get("/api/students", (request, response) => {
  response.status(200).json(db.students);
});

app.get("/api/teachers", (request, response) => {
  response.status(200).json(db.teachers);
});

app.post("/api/students", (request, response) => {
  const student = request.body;
  db.students.push(student);
  writeFileSync("./src/database/db.json", db);

  response.status(201).json({ message: "SE CREO EL RECURSO!!!" });
});

app.post("/api/teachers", (request, response) => {
  const teacher = request.body;
  db.teachers.push(teacher);
  writeFileSync("./src/database/db.json", db);

  response.status(201).json({ message: "SE CREO EL RECURSO!!!" });
});

app.delete("/api/students/id", validateId, (request, response) => {
  const id = request.body.id;
  const students = db.students.filter((student) => id != student.id);
  db.students = students;
  writeFileSync("./src/database/db.json", db);
  response.status(200).json({ message: "SE ELIMINO EL STUDENT!!!" });
});

app.patch("/api/students/id", validateId, (request, response) => {
  const id = request.body.id;
  const student = db.students.find((student) => id == student.id);
  student.name = request.body.name;
  writeFileSync("./src/database/db.json", db);
  response.status(200).json({ message: "SE MODIFICO EL STUDENT!!!" });
});
// TODOS LOS METODOS PARA LOS ENDPOINTS: /STUDENTS Y /TEACHERS

// const obj1 = { id: 1 };
// const obj2 = obj1;

// const primitivo1 = 1;
// const primitivo2 = primitivo1;

app.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
});
