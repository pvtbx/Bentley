const axios = require('axios');
const qs = require('qs'); // for URL parameter encoding

// Step 1: Get the authorization code
const clientId = "<your_client_id>";
const redirectUri = "<your_redirect_uri>";
const scope = "<space_separated_scope_list>"; 

let authCodeRequestUrl = `https://<your_verint_community_site>/api.ashx/v2/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

async function getAccessToken() {
    try {
        const authResponse = await axios.get(authCodeRequestUrl);
        const authCode = authResponse.data.code; // extract authorization code from response

        // Step 2: Get the access token using the authorization code
        let tokenRequestUrl = `https://<your_verint_community_site>/api.ashx/v2/oauth/token`;
        const data = qs.stringify({
            'grant_type': 'authorization_code',
            'client_id': clientId, // only use when the client cannot authenticate using the authentication header
            'client_secret': '<your_client_secret>', // only use when the client cannot authenticate using the authentication header
            'code': authCode,
            'redirect_uri': redirectUri,
            'scope': scope,
        });

        const tokenResponse = await axios.post(tokenRequestUrl, data);
        const accessToken = tokenResponse.data.access_token; // extract access token from response

        console.log(`Access token: ${accessToken}`);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

getAccessToken();
