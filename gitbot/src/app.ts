import { handleIssueOpened } from "./handlers/handleIssueOpened";
import { handleIssueClosed } from "./handlers/handleIssueClosed";
import { handleIssueAssigned } from "./handlers/handleIssueAssigned";
import { handleIssueCommentCreated } from "./handlers/handleIssueCommentCreated";
import { handleIssueCommentEdited } from "./handlers/handleIssueCommentEdited";
import { App } from "@octokit/app";
import dotenv from "dotenv";
dotenv.config();

const app = new App({
  appId: parseInt(process.env.APP_ID || "", 10),
  privateKey: process.env.PRIVATE_KEY || "",
  webhooks: {
    secret: process.env.WEBHOOK_SECRET || "",
  },
});

app.octokit.request("GET /app").then((response) => {
  console.log("App data:", response.data);
})
.catch((error) => {
  console.error("Auth failed:", error);
});

// Register webhook event handlers
app.webhooks.on("issues.opened", async (event) => {
  console.log(`Issue opened:`);
  console.log(event);
  handleIssueOpened(event);
});
app.webhooks.on("issues.closed", async (event) => {
  handleIssueClosed(event);
});
app.webhooks.on("issues.assigned", async (event) => {
  handleIssueAssigned(event);
});
app.webhooks.on("issue_comment.created", async (event) => {
  handleIssueCommentCreated(event);
});
app.webhooks.on("issue_comment.edited", async (event) => {
  handleIssueCommentEdited(event);
});

export default app;
