const uFetch = require("./src/fetch.js");

let url = "http://192.168.242.59:3030/api/demo/tipo/xyZ/dev";
// let url = 'https://dog.ceo/api/breeds/image/random';

let fetch = new uFetch();
//const formData = new FormData();
const formData = { hola: 12 };

fetch.setBearerAuthorization("JFLRSJJJ4J4J477FJ92656HH");

fetch.POST({ url: url, data: formData }).then(async (r) => {
//  console.log(r);

  let result = await r.text();

  console.log("Resultado = ", r, result);
});


fetch.SetBasicAuthentication('Hola', 'mundo').get('https://dog.ceo/api/breeds/image/random').then((r)=>{
console.log(r);
});


