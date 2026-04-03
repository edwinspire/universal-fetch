const uFetch = require("../src/fetch.js");
const api = new uFetch("https://httpbin.org");

async function run() {
  console.log("=== Testing GET request ===");
  
  // Usamos el formato parametrizado nativo. Al ser verbo GET, el contenido 
  // en 'data' automáticamente formará un query param (?hello=world&count=123)
  const res = await api.get({
    url: "/get",
    data: { hello: "world", count: 123 },
    headers: { "Client-Version": "v1.0" }
  });
  
  if (res.ok) {
    const json = await res.json();
    console.log("URL procesada correcta:", json.url);
    console.log("Argumentos Query inyectados:", json.args);
    console.log("Cabeceras enviadas:", json.headers["Client-Version"]);
  } else {
    console.error("GET request falló", res.status);
  }
}

run();
