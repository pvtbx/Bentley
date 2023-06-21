import { DOMParser, XMLSerializer } from 'xmldom';
import https from 'https';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

let apiKey = 'cmak_2445_ILoBJinETRnWyKuzCjmDjQpAplziXpOYkEjUqehffds';
let username = '6dc09cb5-5442-47e2-a67d-088c2a11b8a5';
let token = `${apiKey}:${username}`;
let base64Token = Buffer.from(token).toString('base64');
let listForumsEndpoint = "api.ashx/v2/forums/360/threads.json";
let stagingCommunityInstanceAPI = `https://stage-communities-bentley2-com.telligenthosting.net/${listForumsEndpoint}`;

let serviceNowUser = 'pat.tipps';
let serviceNowPass = 'aJjC)B5>jY9p2yJe]}wt6z2=V5rrC>RAx4=jcA5D';
let serviceNowUserAuth = Buffer.from(serviceNowUser + ':' + serviceNowPass).toString('base64');

const downloadDirectory = './downloads'; // Define the directory where images will be downloaded

export async function createGenerativeComponentQuestions() {
    try {
        const response = await axios.get(stagingCommunityInstanceAPI, {
            headers: {
                'Rest-User-Token': base64Token
            }
        });

        const threads = response.data.Threads;

        for (let i = 0; i < threads.length; i++) {
            let bodyContent = threads[i].Body;

            const parser = new DOMParser();
            const doc = parser.parseFromString(bodyContent, 'text/html');
            const imgTags = doc.getElementsByTagName('img');

            let downloadPromises = [];
            for (let j = 0; j < imgTags.length; j++) {
                const img = imgTags[j];
                const oldUrl = img.getAttribute('src');
                const downloadPromise = downloadImage(oldUrl).then(newUrl => {
                    img.setAttribute('src', newUrl);
                });
                downloadPromises.push(downloadPromise);
            }

            await Promise.all(downloadPromises);

            const serializer = new XMLSerializer();
            const updatedBodyContent = serializer.serializeToString(doc);

            let threadRecord = {
                "question": threads[i].Subject + " [Generative Components Forum]",
                "question_details": updatedBodyContent,
                "kb_knowledge_base": "Generative Components"
            };

            await axios.post('https://bentleysystemsdev.service-now.com/api/now/table/kb_social_qa_question', threadRecord, {
                headers: {
                    'Authorization': 'Basic ' + serviceNowUserAuth,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`Thread ${threads[i].Subject} has been successfully migrated.`);
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function downloadImage(url) {
    const fileName = path.basename(new URL(url).pathname);
    const localPath = path.join(downloadDirectory, fileName);

    const writer = fs.createWriteStream(localPath);

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            response.pipe(writer);

            writer.on('finish', () => resolve(localPath));
            writer.on('error', reject);
        });
    });
}

createGenerativeComponentQuestions();
