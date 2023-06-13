let url = "https://stage-communities-bentley2-com.telligenthosting.net/api.ashx/v2/info.json";

let username = "tippspd"; // Replace with your username
let apiKey = "cmak_2445_hXWC-c6c86mggOAu0c6dFKdI1IGbUimUoRYyTuQ_lEo"; // Replace with your API key

let userToken = `${apiKey}:${username}`;
let encodedUserToken = userToken.toString('base64'); // base64 encoding
console.log(encodedUserToken);

let headers = new Headers({
    "Rest-User-Token": encodedUserToken
});

fetch(url, {
    method: 'GET',
    headers: headers
})
.then(response => response.json())
.then(data => console.log(data)) // Do something with the data
.catch((error) => console.error('Error:', error));
