const axios = require('axios');
const qs = require('qs');

const clientID = 'your_client_id';
const clientSecret = 'your_client_secret';
const tokenUrl = 'https://your-oauth-server.com/token';
const apiUrl = 'https://api.your-server.com/data';

const getToken = async () => {
  const data = qs.stringify({
    'grant_type': 'client_credentials'
  });

  const config = {
    method: 'post',
    url: tokenUrl,
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  try {
    const response = await axios(config);
    return response.data.access_token;
  } catch (error) {
    console.error(`Error in getToken: ${error}`);
    return null;
  }
};

const getData = async (token) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error in getData: ${error}`);
    return null;
  }
};

const run = async () => {
  const token = await getToken();
  if (!token) return;
  const data = await getData(token);
  if (data) console.log(data);
};

run();
