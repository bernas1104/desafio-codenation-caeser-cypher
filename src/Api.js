const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.codenation.dev/v1/challenge/dev-ps',
});

const token = 'eb419ce3be5939b3e565d9beaed68590935a2e44'

const url = 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=eb419ce3be5939b3e565d9beaed68590935a2e44'

module.exports = {
  api,
  token,
  url
};
