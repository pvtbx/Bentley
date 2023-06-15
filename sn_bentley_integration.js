// variables for staging community site
let apiKey = 'cmak_2445_ILoBJinETRnWyKuzCjmDjQpAplziXpOYkEjUqehffds'; // staging community api key
let username = '6dc09cb5-5442-47e2-a67d-088c2a11b8a5'; // staging community profile username
let token = `${apiKey}:${username}`; // authorization for staging site is a concatentation of the api key and the username
let base64Token = Buffer.from(token).toString('base64'); // authorization must be converted to base64 to be passed to staging community instance
let stagingCommunityInstanceAPI = 'https://stage-communities-bentley2-com.telligenthosting.net/api.ashx/v2/forums.json';
console.log(`Staging community Base64 Token: ${base64Token} `);

// variables for connecting to Bentley ServiceNow Dev Instance
let serviceNowInstance = 'https://bentleysystemsdev.service-now.com'; 
let serviceNowTable = 'sn_communities_forum';
let serviceNowUser = 'pat.tipps'; // must be an account with 'Web services' checked - can't be admin account
let serviceNowPass = 'aJjC)B5>jY9p2yJe]}wt6z2=V5rrC>RAx4=jcA5D'; 
let serviceNowUserAuth = Buffer.from(serviceNowUser + ':' + serviceNowPass).toString('base64'); // authorization must be a concatentation of servicenow username and password converted to base64
console.log(`Bentley Dev Base64 Token: ${base64Token} `);

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

  // Gather the names of all Forums
  for(let i = 0; i < data.Forums.length; i++){
    console.log(data.Forums[i].Name + " " + data.Forums[i].Id); // log the data received
  let recordData = {
    "name": data.Forums[i].Name,
    "description" : data.Forums[i].Description
  };
  fetch(`${serviceNowInstance}/api/now/table/${serviceNowTable}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + serviceNowUserAuth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recordData)
  })
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(error => {
    console.log('There was a problem with the fetch operation [Dev Instance]: ' + error.message)
  })
  }})
.catch(error => {
  console.log('There was a problem with the fetch operation [Staging Community]: ' + error.message);
});