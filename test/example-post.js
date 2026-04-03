const uFetch = require("../src/fetch.js");
const api = new uFetch("https://httpbin.org");

async function run() {
  console.log("=== Testing POST request ===");
  
  // Al ser un POST, cualquier payload entregado en `data` será analizado y convertido
  // velozmente en un cuerpo JSON aplicándole el Header adecuado automáticamente, a 
  // menos que envies un formdata, lo cual se trataría de forma nativa e intacta.
  const res = await api.post({
    url: "/post",
    data: { name: "John Doe", profession: "Software Engineer", age: 30 },
  });
  
  if (res.ok) {
    const json = await res.json();
    console.log("Backend recibió efectivamente desde el Request Body:", json.json);
  } else {
    console.error("POST request falló", res.status);
  }
}

run();
