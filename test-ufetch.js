const uFetch = require('./src/fetch.js');

let fetch = new uFetch('https://dog.ceo/api/breeds/image/random');

fetch.setBearerAuthorization('JFLRSJJJ4J4J477FJ92656HH');

fetch.get(null, { hola: 1 }).then(async (r) => {

let result = await r.json();

    console.log('Resultado = ', r, result);
});

/*
fetch.SetBasicAuthentication('Hola', 'mundo').get('https://dog.ceo/api/breeds/image/random').then((r)=>{
console.log(r);
});
*/
