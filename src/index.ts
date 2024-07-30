import express, { json } from "express";
import db from "./database/db.json";
import { writeFileSync } from "jsonfile"; // => es una dependencia que hace lo mismo que el modulo fs de node

const PORT = 8080;
const app = express();

// Los middlewares siempre reciben 3 params: (next es una funcion que permitira dejar pasar al endpoint o no, va a afectar todas las rutas que estes despues)
function validateId(request, response, next) {
  if (!request.body.id)
    return response.status(400).json({ message: "No me mandaste el ID capo" });

  next(); // Funcion para pasar al siguiente middleware o endpoint (Indica que se ejecute lo que sigue, puede ser otro middleware o un endpoint) esto permite encadenar varias funciones.
}

function addProperty(request, response, next) {
  request.user = "Jime";

  next();
}

app.use(json());
app.use(addProperty); // Esta funcion la ejecutara antes de ejecutar el contenido de cada endpoint (y despues le va a dar paso al resto)

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
  db.students.push(student); // push devuelve la longitud nueva del array.
  writeFileSync("./src/database/db.json", db); // => la ruta es desde la carpeta raiz, la ruta absoluta del proyecto.

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
  db.students = students; // Modifico el array students de la copia de la base de datos original con el array que devolvio filter donde ya no esta el student que queria eliminar.
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

// const obj1 = { id: 1 };
// const obj2 = obj1;

// const primitivo1 = 1;
// const primitivo2 = primitivo1;

app.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
});
