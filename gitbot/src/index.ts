import dotenv from "dotenv";
import app from "./app"; // Import the configured app
import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";
import http from "http";

dotenv.config();

const port = process.env.PORT || 3000;
const path = "/api/webhook";
const host = process.env.HOST || "localhost";
const localWebhookUrl = `http://${host}:${3000}${path}`;

const middleware = createNodeMiddleware(app.webhooks, {path});

app.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

http.createServer(middleware).listen(port, () => {
  console.log(`Server is listening for events at: ${localWebhookUrl}`);
  console.log('Press Ctrl + C to quit.')
});
