import dotenv from 'dotenv';
import { DOMParser } from "xmldom";
dotenv.config({path: '../keys.env'});

(async function () {
  let serviceNowUser = process.env.SN_API_USER;
  let serviceNowPass = process.env.SN_API_PASS;
  let serviceNowUserAuth = Buffer.from(
    serviceNowUser + ":" + serviceNowPass
  ).toString("base64");

  let verintAPIKey = process.env.VERINT_API_KEY;
  let verintUsername = process.env.VERINT_API_USER;
  let token = `${verintAPIKey}:${verintUsername}`;
  let base64Token = Buffer.from(token).toString("base64");
  let forumPage = 1;
  let forumPageResults = [];

  while (true) {
    const stagingSiteForumRequest = await fetch(
      `https://stage-communities-bentley2-com.telligenthosting.net/api.ashx/v2/forums.json?pageindex=${forumPage}`,
      {
        method: "GET",
        headers: {
          "Rest-User-Token": base64Token,
        },
      }
    );

    const stagingSiteResponse = await stagingSiteForumRequest.json();

    for (let i = 0; i < stagingSiteResponse.Forums.length; i++) {
      // add threads to ServiceNow

      let forumRecord = {
        name: decodeHTML(stagingSiteResponse.Forums[i].Name),
        description: decodeHTML(stagingSiteResponse.Forums[i].Description),
      };

      function decodeHTML(html){
        var text = new DOMParser().parseFromString(html, "text/html");
        return text.body.textContent;
      }

      const serviceNowQandATableRequest = await fetch(
        "https://bentleysystemsdev.service-now.com/api/now/table/sn_communities_forum",
        {
          method: "POST",
          headers: {
            Authorization: "Basic " + serviceNowUserAuth,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(forumRecord),
        }
      );

      const serviceNowQandATableResponse =
        await serviceNowQandATableRequest.json();
      console.log(serviceNowQandATableResponse);

      let threadPage = 1;
      let threadPageResults = [];

      while (true) {
        const stagingSiteForumThreadRequest = await fetch(
          `https://stage-communities-bentley2-com.telligenthosting.net/api.ashx/v2/forums/${stagingSiteResponse.Forums[i].Id}/threads.json?pageindex=${threadPage}`,
          {
            method: "GET",
            headers: {
              "Rest-User-Token": base64Token,
            },
          }
        );

        const stagingSiteForumThreadResponse =
          await stagingSiteForumThreadRequest.json();

        // this is for printing purposes
        let forumTitle = stagingSiteResponse.Forums[i].Name;
        console.log("Thread Page# " + threadPage + "\n");
        console.log(forumTitle + "\n");

        for (
          let j = 0;
          j < stagingSiteForumThreadResponse.Threads.length;
          j++
        ) {
          console.log(
            "Thread# " +
              j +
              " : " +
              stagingSiteForumThreadResponse.Threads[j].Subject
          );
        }
        console.log("\n");

        threadPageResults = threadPageResults.concat(
          stagingSiteForumThreadResponse.Threads
        );

        if (
          threadPageResults.length >= stagingSiteForumThreadResponse.TotalCount
        ) {
          break;
        }

        threadPage++;
      }
    }

    forumPageResults = forumPageResults.concat(stagingSiteResponse.Forums);

    if (forumPageResults.length >= stagingSiteResponse.TotalCount) {
      break;
    }
    console.log("Forum Page# " + forumPage + "\n");
    forumPage++;
  }
})();
