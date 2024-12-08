import { EmitterWebhookEvent } from "@octokit/webhooks";
import { Octokit } from "octokit";
import { assignContributor, getBounties } from "../web3";
import { commentOnIssue } from "./commentOnIssue";

export const handleIssueAssigned = async ({ octokit, payload }: any
  // {octokit: Octokit, payload : EmitterWebhookEvent<"issues.assigned">['payload']}
) => {
  console.log(`Received an issue assigned event for #${payload.issue.number}`);

  const bounties = await getBounties();
  const bounty = bounties.find((bounty: any) => bounty.issueLink === payload.issue.html_url);

  if (!bounty) {
    console.log('Bounty not found');
    return;
  }

  const contributors = bounty.assignedTo;

  const transactionHash = await assignContributor(bounty.id, payload.assignee.login);
  const message = generateBountyComment(payload.assignee.login, contributors);
  commentOnIssue(octokit, payload.repository.owner.login, payload.repository.name, payload.issue.number, message);

};

function generateBountyComment(username: string, contributors: readonly string[]): string {
  // Create a list of current contributors in Markdown format
  const contributorsList = contributors.map(contributor => `- @${contributor}`).join('\n');

  // Return the formatted Markdown comment
  return `## Welcome, @${username}! 🎉\n\n` +
    `You’ve been assigned to this issue. Thank you for joining the team!\n\n` +
    `Feel free to collaborate with the current contributors:\n` +
    `${contributorsList}\n\n` +
    `Make sure to register on our platform to be eligible for the bounty once resolved. Happy coding! 🚀`;
}