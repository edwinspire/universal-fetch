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

  // Ahora podemos pasar las opciones en un único objeto de configuración.
  const results = await api.batch({
    url: "https://httpbin.org/post",
    method: "POST",
    items: users,
    config: {
      concurrency: 2,
      onProgress: (info) => {
        console.log(`[Progreso]: ${info.completed}/${info.total} -> ${info.item.name}`);
      }
    }
  });

  console.log("\nResultados:");
  results.forEach((res, i) => {
    console.log(`Usuario ${users[i].name}: HTTP ${res.httpCode}`);
  });
}

run();
