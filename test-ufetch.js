const uFetch = require( './src/fetch.js');

let fetch = new  uFetch();

fetch.get('https://dog.ceo/api/breeds/image/random').then((r)=>{
console.log(r);
});

fetch.SetBasicAuthentication('Hola', 'mundo').get('https://dog.ceo/api/breeds/image/random').then((r)=>{
console.log(r);
});
