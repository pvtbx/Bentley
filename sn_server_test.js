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