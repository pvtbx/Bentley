// variables for connecting to Bentley ServiceNow Dev Instance
let serviceNowInstance = 'https://bentleysystemsdev.service-now.com';
let serviceNowTable = 'sn_communities_forum_user';
let serviceNowUser = 'pat.tipps'; // must be an account with 'Web services' checked - can't be admin account
let serviceNowPass = 'aJjC)B5>jY9p2yJe]}wt6z2=V5rrC>RAx4=jcA5D';
let serviceNowUserAuth = Buffer.from(serviceNowUser + ':' + serviceNowPass).toString('base64'); // authorization must be a concatentation of servicenow username and password converted to base64
console.log(`Bentley Dev Base64 Token: ${serviceNowUserAuth} `);

export function createBentleyForumUsers(data){
  // Gather the names of all Forums
  for (let i = 0; i < data.Forums.length; i++) {
    console.log(data.Forums[i].Name + " " + data.Forums[i].Id); // log the data received
    if(data.Forums[i].Description.length == 0){
      data.Forums[i].Description == "For questions and discussions relating to " + data.Forums[i].Name; 
    }
    let forumUser = "Members of " + data.Forums[i].Name;
    let recordData = { // data that will be appended to new record
      "name": forumUser,
      "description": data.Forums[i].Description
    };
    fetch(`${serviceNowInstance}/api/now/table/${serviceNowTable}`, { // make an call to the Table API
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
  }
}