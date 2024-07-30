type method = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

async function fetchData(params: {
  url: string;
  method?: method;
  body?: object;
}) {
  // CON LA ASIGNACION LE DEFINO EL VALOR POR DEFECTO QUE TOMARÁ EL PARAMETRO CUANDO NO ME ENVIEN NADA AL INVOCAR LA FUNCIÓN
  const response = await fetch(`http://localhost:8080/${params.url}`, {
    method: params.method, // SE PUEDE SIMPLIFICAR DEJANDO SOLO METHOD Y COMO VALOR LE COLOCARÁ LA VARIABLE CON ESE MISMO NOMBRE
    body: JSON.stringify(params.body),
    headers: { "content-type": "application/json" }, // => Le estamos indicando al servidor que le estamos mandando un json. Porque cuando uso el metodo json en el middleware: app.use(json()), el servidor revisa si la solicitud tiene como encabezado application/json.
  });

  console.log(response.status);

  const data = await response.json();
  console.log(data);

  return data;
}

async function main() {
  const data = await fetchData({
    url: "api",
    // body: { id: 1 },
    method: "GET",
  });
}

main();
