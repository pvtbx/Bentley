let serviceNowUser = 'pat.tipps'; // must be an account with 'Web services' checked - can't be admin account
let serviceNowPass = 'aJjC)B5>jY9p2yJe]}wt6z2=V5rrC>RAx4=jcA5D';
let serviceNowUserAuth = Buffer.from(serviceNowUser + ':' + serviceNowPass).toString('base64'); // authorization must be a concatentation of servicenow username and password converted to base64

function populate(){
    let recordData = { // data that will be appended to new record
        "question": "Forum Topic Test1",
        "kb_knowledge_base": "SN_Community"
      };

      fetch(`https://bentleysystemsdev.service-now.com/api/now/table/kb_social_qa_question`, { // make an call to the Table API
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

populate();