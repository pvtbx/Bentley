(async function () {
  let serviceNowUser = "pat.tipps";
  let serviceNowPass = "aJjC)B5>jY9p2yJe]}wt6z2=V5rrC>RAx4=jcA5D";
  let serviceNowUserAuth = Buffer.from(
    serviceNowUser + ":" + serviceNowPass
  ).toString("base64");

  let apiKey = "cmak_2445_ILoBJinETRnWyKuzCjmDjQpAplziXpOYkEjUqehffds";
  let username = "6dc09cb5-5442-47e2-a67d-088c2a11b8a5";
  let token = `${apiKey}:${username}`;
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
        name: stagingSiteResponse.Forums[i].Name,
        description: stagingSiteResponse.Forums[i].Description,
      };

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
