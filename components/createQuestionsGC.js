import { DOMParser, XMLSerializer } from 'xmldom';
import axios from 'axios';
import cloudinary from 'cloudinary';

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: 'dltlbdrja',
    api_key: '522675282662213',
    api_secret: '5vnWTo0sO8Z22EaDt_kfHQBAbzk',
    secure: true
});

let apiKey = 'cmak_2445_ILoBJinETRnWyKuzCjmDjQpAplziXpOYkEjUqehffds';
let username = '6dc09cb5-5442-47e2-a67d-088c2a11b8a5';
let token = `${apiKey}:${username}`;
let base64Token = Buffer.from(token).toString('base64');
let listForumsEndpoint = "api.ashx/v2/forums.json";
let stagingCommunityInstanceAPI = `https://stage-communities-bentley2-com.telligenthosting.net/${listForumsEndpoint}`;

let serviceNowUser = 'pat.tipps';
let serviceNowPass = 'aJjC)B5>jY9p2yJe]}wt6z2=V5rrC>RAx4=jcA5D';
let serviceNowUserAuth = Buffer.from(serviceNowUser + ':' + serviceNowPass).toString('base64');

export async function createGenerativeComponentQuestions() {
    try {
        // Fetch all forums
        const forumsResponse = await axios.get(stagingCommunityInstanceAPI, {
            headers: {
                'Rest-User-Token': base64Token
            }
        });

        const forums = forumsResponse.data; // Assuming this returns an array of forum objects
        console.log(forums.Forums[0].Name);
        // for (let forum of forums) {
        //     let forumId = forum.id; // Assuming each forum object has an id property
        //     console.log(forumId);

            // Now fetch threads for each forum
            // let listThreadsEndpoint = `api.ashx/v2/forums/${forumId}/threads.json`;
            // let stagingInstanceAPI = `https://stage-communities-bentley2-com.telligenthosting.net/${listThreadsEndpoint}`;

            // const response = await axios.get(stagingInstanceAPI, {
            //     headers: {
            //         'Rest-User-Token': base64Token
            //     }
            // });

            // const threads = response.data.Threads;

            // for (let i = 0; i < threads.length; i++) {
            //     let bodyContent = threads[i].Title;

                // const parser = new DOMParser();
                // const doc = parser.parseFromString(bodyContent, 'text/html');
                // const imgTags = doc.getElementsByTagName('img');

                // let downloadPromises = [];
                // for (let j = 0; j < imgTags.length; j++) {
                //     const img = imgTags[j];
                //     const oldUrl = img.getAttribute('src');
                //     const downloadPromise = uploadImage(oldUrl).then(newUrl => {
                //         img.setAttribute('src', newUrl);
                //     });
                //     downloadPromises.push(downloadPromise);
                // }

                // await Promise.all(downloadPromises);

                // const serializer = new XMLSerializer();
                // const updatedBodyContent = serializer.serializeToString(doc);

                // let threadRecord = {
                //     "question": threads[i].Subject + `[${threads[i].Subject}]`, // change this back to [Generative Components]
                //     "question_details": bodyContent, // change this back to updatedBodyContent
                //     // "kb_knowledge_base": "Generative Components"
                // };

                // await axios.post('https://bentleysystemsdev.service-now.com/api/now/table/kb_social_qa_question', threadRecord, {
                //     headers: {
                //         'Authorization': 'Basic ' + serviceNowUserAuth,
                //         'Content-Type': 'application/json'
                //     }
                // });

                // console.log(`Thread ${threads[i].Subject} has been successfully migrated.`);
            // }
        // }
    } catch (error) {
        console.error(error.message);
    }
}

// Uploads an image file
async function uploadImage(url) {
    try {
        const result = await cloudinary.v2.uploader.upload(url, {
            folder: 'generative_components'
        });
        return result.secure_url;
    } catch (error) {
        console.error(error.message);
    }
}
createGenerativeComponentQuestions();