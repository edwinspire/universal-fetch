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

/*
fetch.SetBasicAuthentication('Hola', 'mundo').get('https://dog.ceo/api/breeds/image/random').then((r)=>{
console.log(r);
});
*/

let url_servicio_sri =
  "https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl";
const uF = new uFetch();
const resp = uF
  .GET({ url: url_servicio_sri, headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-language": "es-ES,es;q=0.9",
    "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "sec-gpc": "1",
    "upgrade-insecure-requests": "1",
    cookie:
      "dtCookie07lujgah=v_4_srv_5_sn_80BC4C8CF763005D033278C431423B42_perc_100000_ol_0_mul_1_app-3Aea7c4b59f27d43eb_1_rcs-3Acss_0; TS010a7529=0115ac86d2700a36ac29b3d86e071e2cce62f03b2d255c52b6abe40282a4252da15cf599586175326f89f89cabff11abc5208de3f7921ffce33ff9bd17526ac8d55ba4436f",
  } })
  .then(async(r) => {
    console.log(r);
    return r;
  })
  .catch((e) => {
    console.log("Error = ", e);
  });
console.log("Respuesta = ", resp);
