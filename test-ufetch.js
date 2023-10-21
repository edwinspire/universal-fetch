const uFetch = require('./src/fetch.js');

let fetch = new uFetch('https://dog.ceo/api/breeds/image/random');

fetch.get(null, { hola: 1 }).then((r) => {
    console.log('Resultado = ', r);
});


/*
fetch.SetBasicAuthentication('Hola', 'mundo').get('https://dog.ceo/api/breeds/image/random').then((r)=>{
console.log(r);
});
*/
