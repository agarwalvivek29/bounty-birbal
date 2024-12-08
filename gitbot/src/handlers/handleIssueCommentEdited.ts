import { EmitterWebhookEvent } from "@octokit/webhooks";
import { Octokit } from "octokit";

export const handleIssueCommentEdited = async ({ octokit, payload }: any
  // {octokit: Octokit, payload: EmitterWebhookEvent<"issue_comment.edited">['payload']}
) => {
  console.log(`Received an issue comment edited event for #${payload.issue.number}`);

  // Implement your logic here
};
