const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// declare your client id and secret here
const clientId = '39c758b3-36a7-4440-9371-30c35acc2cc9';
const clientSecret = 'cmcs_phxoMab_88mcFJUFgoC2MlM-1DuIInksR6FB8GOZo6I';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/oauth-callback', async (req, res) => {
  const authorizationCode = req.query.code;

  // Now, you would exchange the code for an access token. This depends on the OAuth server you're using. 
  // You would usually make a POST request to their token URL, including your client ID, client secret, and the authorization code.
  // Here, we're just displaying the authorization code.

  try {
    const response = await axios.post('https://your-oauth-provider.com/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code: authorizationCode,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });
  
    const accessToken = response.data.access_token;
  res.send(`Access Token: ${accessToken}`);
} catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
