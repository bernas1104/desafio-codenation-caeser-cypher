const path = require('path');
const fs = require('fs');
const sha1 = require('sha1');
const mz = require('mz/fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

const codenation = require('./Api');

const filePath = path.resolve(__dirname, 'answer.json');

async function fetchJSONFile() {
  const { data } = await codenation.api.get(
    `generate-data?token=${codenation.token}`
  );

  fs.writeFileSync(filePath, JSON.stringify(data));

  return data;
}

function decryptCypher(data) {
  let { cifrado, numero_casas, decifrado } = data;

  decifrado = '';

  for(let i = 0; i < cifrado.length; i++){
    if(cifrado.charCodeAt(i) >= 97 && cifrado.charCodeAt(i) <= 122){
      let charCode = (cifrado.charCodeAt(i) - 'a'.charCodeAt(0)) - numero_casas;

      if(charCode < 0) charCode += 26;

      decifrado += String.fromCharCode(charCode + 97);
    } else {
      decifrado += cifrado[i];
    }
  }

  data.decifrado = decifrado;
  data.resumo_criptografico = sha1(decifrado);

  sendResults(data);
}

async function sendResults(results) {
  const form = new FormData();

  fs.writeFileSync(filePath, JSON.stringify(results));

  const answer = fs.createReadStream(filePath);
  form.append('answer', answer);

  try {
    const score = await codenation.api.post(
      `submit-solution?token=${codenation.token}`,
      form,
      {
        headers: form.getHeaders(),
      }
    )

    console.log(score);
  } catch (err) {
    console.log(err);
  }
}

(async function run() {
  let data;

  const exists = await mz.exists(filePath);

  if(!exists){
    data = await fetchJSONFile();
  } else {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  decryptCypher(data);
})();
