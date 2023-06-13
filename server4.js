let apiKey = 'cmak_2445_ILoBJinETRnWyKuzCjmDjQpAplziXpOYkEjUqehffds';
let username = '6dc09cb5-5442-47e2-a67d-088c2a11b8a5';
let token = `${apiKey}:${username}`;
let base64Token = Buffer.from(token).toString('base64');
let serviceNowInstance = 'https://dev77282.service-now.com';
let serviceNowTable = 'incident';
let serviceNowUser = 'pat.tipps';
let serviceNowPass = '{NFeof:CGo,6-Vl60S?Wj>#kBxhalUG5lMm)W$<#ll1(3M#x-xAM2h;HzB1+DGs#<@!F[CEb0b_V{UFh.[Xq+l)Z1d@2aU*B*Ey5'; 

fetch('https://stage-communities-bentley2-com.telligenthosting.net/api.ashx/v2/forums/273/threads/235789/replies.json', {
  method: 'GET',
  headers: {
    'Rest-User-Token': base64Token
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json(); // if the response is OK, this returns a promise
})
.then(data => {
  console.log(data.Replies[0].Body); // log the data received

  let recordData = {
    "description" : data.Replies[0].Body
  };

  console.log('First fetch finished. Now attempting ServiceNow API');
  
  fetch(`${serviceNowInstance}/api/now/table/${serviceNowTable}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(serviceNowUser + ':' + serviceNowPass).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recordData)
  })
  .then(response => response.json())
  .then(json => console.log(json));
})
.catch(error => {
  console.log('There was a problem with the fetch operation: ' + error.message);
});
