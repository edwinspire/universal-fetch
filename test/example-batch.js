const uFetch = require("../src/fetch.js");

// Definimos la API origen
const api = new uFetch("https://httpbin.org");

async function run() {
  console.log("=== Testing BATCH Parallel Processing ===");
  
  // Improntamos 5 consultas pesadas / peligrosas. Notar que algunas fallarán
  // artificialmente mediante status/500 y status/404 para demostrar la resiliencia (Fail-Safe).
  const payloadList = [
    { target: "status/200", id: 1 },
    { target: "status/201", id: 2 },
    { target: "status/404", id: 3 }, // Fallará el promise con este HTTP code
    { target: "status/500", id: 4 }, // Destrucción en backend
    { target: "status/202", id: 5 }
  ];

  const results = await api.batch(payloadList, {
    concurrency: 3, // Procesará a chorros máximos de a 3 conexiones concurrentes
    method: "GET",  // Todo se mandara por verbo GET
    buildRequest: (item) => ({
      url: `https://httpbin.org/${item.target}`
    }),
    
    // Este Trigger se activa instantáneamente al resolver un hilo/worker (favorable o con excepción)
    onProgress: (info) => {
      console.log(`[Progreso en vivo]: ${info.completed}/${info.total} -> ${info.item.target}`);
      if (info.isError) {
         console.warn(`    \\--> [AVISO] Falló la petición por culpa de un código no favorable y el backend cortó conexión.`);
      } else {
         console.log(`    \\--> [EXITO] Respuesta HTTP lograda: ${info.httpCode}`);
      }
    }
  });

  console.log("\n=========================");
  console.log("RESUMEN DEL ARRAY GLOBAL DEVUELTO:");
  console.log("=========================");
  
  results.forEach((res, i) => {
    const errorSufix = res.isError ? " (Falló - FailSafe capturó el error en la posición del array)" : " (Válido)";
    console.log(`-> Petición Num [${i + 1}] terminó reportando un HTTP: ${res.httpCode} ${errorSufix}`);
  });
}

run();
