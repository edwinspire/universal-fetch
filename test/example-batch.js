const uFetch = require("../src/fetch.js");

// Definimos la API origen
const api = new uFetch("https://httpbin.org");

async function run() {
  console.log("=== Testing BATCH Parallel Processing ===");
  
  const payloadList = [
    { url: "https://httpbin.org/status/200", target: "status/200" },
    { url: "https://httpbin.org/status/201", target: "status/201" },
    { url: "https://httpbin.org/status/404", target: "status/404" },
    { url: "https://httpbin.org/status/500", target: "status/500" },
    { url: "https://httpbin.org/status/202", target: "status/202" }
  ];

  // Nueva forma limpia: usando un único objeto de configuración
  const results = await api.batch({
    url: null,
    method: "GET",
    items: payloadList,
    config: {
      concurrency: 3,
      onProgress: (info) => {
        console.log(`[Progreso en vivo]: ${info.completed}/${info.total} -> ${info.item.target}`);
        if (info.isError) {
           console.warn(`    \\--> [AVISO] Falló la petición por culpa de un código no favorable.`);
        } else {
           console.log(`    \\--> [EXITO] Respuesta HTTP lograda: ${info.httpCode}`);
        }
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
