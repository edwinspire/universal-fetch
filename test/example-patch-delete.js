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

  console.log("\n=== Testing DELETE request with query params via data ===");
  const deleteQueryRes = await api.delete({
    url: "/delete",
    data: { item_id: 99, filter: "active" } // Debe enviarse en el query string (?item_id=99&filter=active)
  });
  console.log("-> DELETE status code:", deleteQueryRes.status);
  const queryResObj = await deleteQueryRes.json();
  console.log("-> Query params recibidos por servidor (args):", queryResObj.args);
  console.log("-> Body recibido por servidor (json):", queryResObj.json);

  console.log("\n=== Testing DELETE request with body parameters via body ===");
  const deleteBodyRes = await api.delete({
    url: "/delete",
    body: { item_id: 100, reason: "cleanup" } // Debe enviarse en el body JSON
  });
  console.log("-> DELETE status code:", deleteBodyRes.status);
  const bodyResObj = await deleteBodyRes.json();
  console.log("-> Query params recibidos por servidor (args):", bodyResObj.args);
  console.log("-> Body recibido por servidor (json):", bodyResObj.json);

  console.log("\n=== Testing DELETE request with both data (query) and body (payload) ===");
  const deleteBothRes = await api.delete({
    url: "/delete",
    data: { force: "true" }, // query params
    body: { ids: [1, 2, 3] } // body payload
  });
  console.log("-> DELETE status code:", deleteBothRes.status);
  const bothResObj = await deleteBothRes.json();
  console.log("-> Query params recibidos por servidor (args):", bothResObj.args);
  console.log("-> Body recibido por servidor (json):", bothResObj.json);
}

run();
