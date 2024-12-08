export const handleIssueOpened = async ({octokit, payload }: any) => {
  console.log(`Received an issue opened event for #${payload.issue.number}`);

  const message = generateIssueCreationNotification(payload.repository.owner.login);

  try {
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      body: message,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    });
  } catch (error: any) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`);
    }
    console.error(error);
  }
};

function generateIssueCreationNotification(maintainer: string): string {
  return `## 🚀 Hey, @${maintainer}! 🚀\n\n` +
    `The Bounty Dispenser is active on this repository! You can start managing bounties using the available commands.\n\n` +
    `Need help? Just type **/help** to see the list of commands for assigning and managing bounties on issues. Let’s get those contributions rolling! 💪`;
}
