/* ABOUT

  This script is used to perform an integration between the Bentley staging site where all of Bentley's community data is stored,
  and insert the community data into ServiceNow Communities

*/
// variables for staging community site
import { createBentleyForums } from "./modules/createForums.js";
let apiKey = 'cmak_2445_ILoBJinETRnWyKuzCjmDjQpAplziXpOYkEjUqehffds'; // staging community api key
let username = '6dc09cb5-5442-47e2-a67d-088c2a11b8a5'; // staging community profile username
let token = `${apiKey}:${username}`; // authorization for staging site is a concatentation of the api key and the username
let base64Token = Buffer.from(token).toString('base64'); // authorization must be converted to base64 to be passed to staging community instance
let stagingCommunityInstanceAPI = 'https://stage-communities-bentley2-com.telligenthosting.net/api.ashx/v2/forums.json';
console.log(`Staging community Base64 Token: ${base64Token} `);

function makeCallToStagingInstance(){
  fetch(`${stagingCommunityInstanceAPI}`, { // make API call to staging community instance
  method: 'GET',
  headers: {
    'Rest-User-Token': base64Token // Rest-User-Token MUST be passed as authorization
  }
})
  .then(response => {
    if (!response.ok) { // if there's no response, return an error
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // if the response is OK, this returns a promise
  })
  .then(data => {
    createBentleyForums(data);
  });
};
makeCallToStagingInstance();