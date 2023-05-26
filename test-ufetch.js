 import uFetch from  './src/fetch.js';

let fetch = new  uFetch();

fetch.get('https://dog.ceo/api/breeds/image/random').then((r)=>{
console.log('Resultado = ', r);
});


/*
fetch.SetBasicAuthentication('Hola', 'mundo').get('https://dog.ceo/api/breeds/image/random').then((r)=>{
console.log(r);
});
*/
