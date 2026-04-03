const uFetch = require("../src/fetch.js");

async function run() {
  console.log("=== Testing Core request(), Authentication & AbortController ===");
  
  const api = new uFetch("https://httpbin.org");
  
  // Estableciendo métodos de Autenticación de manera Global para toda esta Instancia
  api.setBearerAuthorization("my_super_secret_jwt_token");
  api.addHeader("X-Company-Name", "TechCorp Ltd.");

  // Configuro una petición intencionadamente lenta (3 segundos de espera obligada por el servidor)
  // Utilizaremos el método general de más bajo nivel: api.request()
  console.log("-> Iniciando un fetch que demora 3 segundos de forma cruda...");
  const delayedRequest = api.request("/delay/3", "GET");
  
  // Apenas pasa 1 segundo, digamos que el usuario o tu timeout manual decidió abortar todo.
  setTimeout(() => {
    console.log("-> [TIMING: 1 Segundo pasó]. El usuario presiona Cancelar!");
    api.abort("El usuario o el sistema abortó prematuramente.");
  }, 1000);

  try {
    const res = await delayedRequest;
    console.log("-> Peticion terminada de puro milagro exitosamente status:", res.status);
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("-> [CAPTURA EXITOSA] Exception interceptada nativamente: Se detectó un AbortError porque la petición fue cancelada a medio vuelo antes de recibir la respuesta pesada.");
    } else {
      console.error("-> Error desconocido:", error);
    }
  }
}

run();
