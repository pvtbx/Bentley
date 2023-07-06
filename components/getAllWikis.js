// Require necessary libraries
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({path: '../keys.env'});

// Define Verint API parameters
let verintAPIKey = process.env.VERINT_API_KEY;
let verintUsername = process.env.VERINT_API_USER;
let token = `${verintAPIKey}:${verintUsername}`;
let base64Token = Buffer.from(token).toString('base64');

// Define ServiceNow API parameters
const SN_API_BASE_URL = process.env.SN_API_BASE_URL;
const SN_API_USER = process.env.SN_API_USER;
const SN_API_PASS = process.env.SN_API_PASS;

// Function to get all wikis from Verint
async function getWikisFromVerint() {
    const response = await axios.get(`${VERINT_API_BASE_URL}/wikis`, {
        headers: {
            'Authorization': `Bearer ${VERINT_API_KEY}`
        }
    });
    return response.data;
}

// Function to add wikis to ServiceNow
async function addWikiToServiceNow(wiki) {
    const response = await axios.post(`${SN_API_BASE_URL}/table/kb_knowledge`, wiki, {
        auth: {
            username: SN_API_USER,
            password: SN_API_PASS
        }
    });
    return response.data;
}

// Main function to get and add wikis
async function getAndAddWikis() {
    try {
        // Get all wikis from Verint
        const wikis = await getWikisFromVerint();

        // Loop through each wiki
        for (let wiki of wikis) {
            // Map Verint wiki fields to ServiceNow kb_knowledge fields
            const snWiki = {
                short_description: wiki.title,
                text: wiki.content,
                // Add more fields as needed...
            };

            // Add wiki to ServiceNow
            await addWikiToServiceNow(snWiki);
        }

        console.log('All wikis have been added to ServiceNow successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Run the script
getAndAddWikis();
