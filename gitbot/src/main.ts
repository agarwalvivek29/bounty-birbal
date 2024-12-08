// import { Octokit } from "octokit";
// import { createAppAuth } from "@octokit/auth-app";

// const octokit = new Octokit({
//   authStrategy: createAppAuth,
//   auth: {
//     appId: parseInt(process.env.APP_ID || "", 10),
//     privateKey: process.env.PRIVATE_KEY || "",
//     installationId: 53678700,  // Replace with a static ID for testing
//   },
// });

// async function testAuth() {
//   try {
//     const { data } = await octokit.request("GET /app");
//     console.log("App data:", data);
//   } catch (error) {
//     console.error("Auth failed:", error);
//   }
// }

// testAuth();
