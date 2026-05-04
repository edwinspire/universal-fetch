const uFetch = require("../src/fetch.js");

const api = new uFetch("https://httpbin.org");

async function run() {
  console.log("=== Testing BATCH without buildRequest (New Feature) ===");
  
  // Lista de objetos que queremos enviar por POST al mismo endpoint
  const users = [
    { name: "Edwin", email: "edwin@example.com" },
    { name: "John", email: "john@example.com" },
    { name: "Jane", email: "jane@example.com" }
  ];

  console.log("Enviando usuarios en lote...");

  // Ahora podemos pasar la URL, el método y los items directamente.
  // No necesitamos definir un callback buildRequest si el item ya es el cuerpo de la petición.
  const results = await api.batch("https://httpbin.org/post", "POST", users, {}, {}, {
    concurrency: 2,
    onProgress: (info) => {
      console.log(`[Progreso]: ${info.completed}/${info.total} -> ${info.item.name}`);
    }
  });

  console.log("\nResultados:");
  results.forEach((res, i) => {
    console.log(`Usuario ${users[i].name}: HTTP ${res.httpCode}`);
  });
}

run();
