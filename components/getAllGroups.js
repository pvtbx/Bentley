import dotenv from 'dotenv';
dotenv.config({ path: '../keys.env' });
let verintAPIKey = process.env.VERINT_API_KEY;
let verintUsername = process.env.VERINT_API_USER;
let token = `${verintAPIKey}:${verintUsername}`;
let base64Token = Buffer.from(token).toString('base64');

// Define ServiceNow API parameters
const SN_API_BASE_URL = process.env.SN_API_BASE_URL;
const SN_API_USER = process.env.SN_API_USER;
const SN_API_PASS = process.env.SN_API_PASS;

(async () => {
    const request = await fetch('https://stage-communities-bentley2-com.telligenthosting.net/api.ashx/v2/groups.json', {
        method: 'GET',
        headers: {
            'Rest-User-Token': base64Token
        }
    });
    const response = await request.json();

    for (let i = 0; i < response.Groups.length; i++) {

        // const request2 = await fetch(`https://stage-communities-bentley2-com.telligenthosting.net/api.ashx/v2/${response.Groups[i].Id}/wikis.json`, {
        //     method: 'GET',
        //     headers: {
        //         'Rest-User-Token': base64Token
        //     }
        // });

        // const response2 = await request2.json();
        // if (response2.status !== 200) {
        //     console.error('Error:', response2.status, response2.statusText);
        // } else {
        //     console.log(response2);
        // }

    }
})();