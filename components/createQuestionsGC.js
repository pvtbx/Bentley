// Import necessary modules
import { DOMParser, XMLSerializer } from 'xmldom';
import https from 'https';
import axios from 'axios';
import FormData from 'form-data';

// API credentials
let apiKey = '<my-api-key>';
let username = '<my-user-name>';
let token = `${apiKey}:${username}`;
let base64Token = Buffer.from(token).toString('base64');
let listForumsEndpoint = "api.ashx/v2/forums/360/threads.json";
let stagingCommunityInstanceAPI = `https://stage-communities-bentley2-com.telligenthosting.net/${listForumsEndpoint}`;

let serviceNowUser = 'pat.tipps';
let serviceNowPass = 'aJjC)B5>jY9p2yJe]}wt6z2=V5rrC>RAx4=jcA5D';
let serviceNowUserAuth = Buffer.from(serviceNowUser + ':' + serviceNowPass).toString('base64');

// Imgur Client ID for API access - replace with your own
const imgurClientId = '<your-imgur-client-id>';

export async function createGenerativeComponentQuestions() {
    try {
        // Make a request to the staging API
        const response = await axios.get(stagingCommunityInstanceAPI, {
            headers: {
                'Rest-User-Token': base64Token
            }
        });

        // Extract threads from the response
        const threads = response.data.Threads;

        // Iterate over each thread
        for (let i = 0; i < threads.length; i++) {
            let bodyContent = threads[i].Body;

            // Parse the body content as HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(bodyContent, 'text/html');

            // Find all image tags in the document
            const imgTags = doc.getElementsByTagName('img');

            // Initialize an array to hold promises for each image upload
            let uploadPromises = [];

            // Iterate over each image tag
            for (let j = 0; j < imgTags.length; j++) {
                const img = imgTags[j];
                const oldUrl = img.getAttribute('src');

                // Create a promise to upload the image to Imgur and replace the src attribute
                const uploadPromise = uploadImageToImgur(oldUrl, imgurClientId).then(newUrl => {
                    img.setAttribute('src', newUrl);
                });

                // Add the promise to the array
                uploadPromises.push(uploadPromise);
            }

            // Wait for all images to be uploaded
            await Promise.all(uploadPromises);

            // Serialize the updated document back into a string
            const serializer = new XMLSerializer();
            const updatedBodyContent = serializer.serializeToString(doc);

            // Prepare the data to be posted to the ServiceNow API
            let threadRecord = {
                "question": threads[i].Subject + " [Generative Components Forum]",
                "question_details": updatedBodyContent,
                "kb_knowledge_base": "Generative Components"
            };

            // Post the data to the ServiceNow API
            await axios.post('https://bentleysystemsdev.service-now.com/api/now/table/kb_social_qa_question', threadRecord, {
                headers: {
                    'Authorization': 'Basic ' + serviceNowUserAuth,
                    'Content-Type': 'application/json'
                }
            });

            // Log a success message
            console.log(`Thread ${threads[i].Subject} has been successfully migrated.`);
        }
    } catch (error) {
        // Log any errors that occur
        console.error(error.message);
    }
}

// Function to upload an image to Imgur and return the new URL
async function uploadImageToImgur(url, clientId) {
    // Make a GET request to the image URL and receive the response as a stream
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });

    // Initialize form data
    let formData = new FormData();

    // Append the image stream to the form data
    formData.append('image', response.data);

    // Post the image to Imgur
    const imgurResponse = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
            // Include the Imgur Client ID in the Authorization header
            'Authorization': `Client-ID ${clientId}`,
            // Spread the form data headers
            ...formData.getHeaders()
        }
    });

    // Return the link of the uploaded image
    return imgurResponse.data.data.link;
}

// Call the main function
createGenerativeComponentQuestions();