(async function () {
// Define ServiceNow API parameters
const SN_API_BASE_URL = process.env.SN_API_BASE_URL;
const SN_API_USER = process.env.SN_API_USER;
const SN_API_PASS = process.env.SN_API_PASS;
  let serviceNowUserAuth = Buffer.from(
    SN_API_USER + ":" + SN_API_PASS
  ).toString("base64");

// Define Verint API parameters
let verintAPIKey = process.env.VERINT_API_KEY;
let verintUsername = process.env.VERINT_API_USER;
let verintAPIURL = process.env.VERINT_API_BASE_URL;
let token = `${verintAPIKey}:${verintUsername}`;
let base64Token = Buffer.from(token).toString('base64');

  let blogPage = 1;

  while (true) {
    const stagingSiteBlogRequest = await fetch(
      `${verintAPIURL}/v2/blogs.json?pageindex=${blogPage}`,
      {
        method: "GET",
        headers: {
          "Rest-User-Token": base64Token,
        },
      }
    );

    const stagingSiteResponse = await stagingSiteBlogRequest.json();

    if (stagingSiteResponse.Blogs.length === 0) {
      break;
    }

    for (let i = 0; i < stagingSiteResponse.Blogs.length; i++) {
      // let blogRecord = {
      //   name: stagingSiteResponse.Blogs[i].Name,
      //   description: stagingSiteResponse.Blogs[i].Description,
      //   // Add any other fields you need to map from Verint to ServiceNow
      // };

      // const serviceNowBlogTableRequest = await fetch(
      //   `${SN_API_BASE_URL}/api/now/table/sn_communities_blog`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: "Basic " + serviceNowUserAuth,
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(blogRecord),
      //   }
      // );

      // const serviceNowBlogTableResponse =
      //   await serviceNowBlogTableRequest.json();

      let blogSysId = serviceNowBlogTableResponse.result.sys_id;
      console.log(blogSysId);
    }
    blogPage++;
  }
})();
