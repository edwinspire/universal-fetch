const uFetch = require("../src/fetch.js");
const api = new uFetch("https://httpbin.org");

async function run() {
  console.log("=== Testing PATCH request ===");
  // Recomendado para mutaciones de un fragmento de una entidad (No total como PUT)
  const patchRes = await api.patch({
    url: "/patch",
    data: { role: "Administrator" }
  });
  console.log("-> PATCH status code respondido:", patchRes.status);
  console.log("-> Servidor reflejó parcheo sobre:", await patchRes.json().then(j => j.json));

  console.log("\n=== Testing DELETE request ===");
  const deleteRes = await api.delete({
    url: "/delete?item_id=99", // Usualmente delete no usa body, sino identifiers
  });
  console.log("-> DELETE status code:", deleteRes.status);
}

run();
