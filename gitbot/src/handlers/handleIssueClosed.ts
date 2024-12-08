import { EmitterWebhookEvent } from "@octokit/webhooks";
import { Octokit } from "octokit";

export const handleIssueClosed = async ({ octokit, payload }: any
  // {octokit: Octokit, payload: EmitterWebhookEvent<"issues.closed">["payload"]}
) => {
  console.log(`Received an issue closed event for #${payload}`);

  // Implement your logic here
};
