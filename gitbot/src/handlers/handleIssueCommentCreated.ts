import { EmitterWebhookEvent } from "@octokit/webhooks";
import { Octokit } from "octokit";
import { createBounty, rewardBounty } from "../web3";
import { commentOnIssue } from "./commentOnIssue";

export const handleIssueCommentCreated = async ({ octokit, payload }: any
  // {octokit: Octokit, payload: EmitterWebhookEvent<"issue_comment.created">["payload"]}
) => {
  console.log(`
    Repository : ${payload.repository.full_name}
    Issue: ${payload.issue.title} #${payload.issue.number}
    Comment: ${payload.comment.user.login} - ${payload.comment.body}
  `);
  // Implement your logic here

  if ( payload.comment.user.login === payload.repository.owner.login ) {
    console.log(`Owner commented`);
    console.log('Check for Actions');
    
    if ( payload.comment.body.includes('/bounty') ) {
      console.log('Bounty action detected');
      const bounty = payload.comment.body.match(/\/bounty (\d+(\.\d+)?)(ETH)?/);
      if ( !bounty ) {
        console.log('Invalid bounty amount');
        commentOnIssue(octokit, payload.repository.owner.login, payload.repository.name, payload.issue.number, generateInvalidFundInputComment(payload.repository.owner.login, ''));
        return;
      }

      console.log(`Bounty: ${bounty}`);
      const amt: string = parseFloat(bounty[1]).toExponential();
      let [base, exponent]: number[] = amt.split('e').map(Number);

      const trxnHash = await createBounty(base, Math.abs(exponent) ,payload.issue.html_url, payload.repository.owner.login);

      if ( !trxnHash ) {
        console.log('Invalid bounty action, bounty not found');
        commentOnIssue(octokit, payload.repository.owner.login, payload.repository.name, payload.issue.number, generateErrorMessage(payload.repository.owner.login));
        return;
      }

      try {
        await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          issue_number: payload.issue.number,
          body: generateBountyCreatedMessage(payload.repository.owner.login, bounty[1], trxnHash),
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
    }
    if ( payload.comment.body.includes('/reward') ) {
      console.log('Reward action detected');
      const reward = payload.comment.body.match(/\/reward @(\w+)/);

      if ( !reward ) {
        console.log('Invalid reward action, username not found');
        commentOnIssue(octokit, payload.repository.owner.login, payload.repository.name, payload.issue.number, generateInvalidUsernameComment(payload.repository.owner.login, ''));
        return;
      }

      try{
        const response = await fetch(`https://api.github.com/users/${reward[1]}`);
        const user = await response.json();
        if ( !user.login ) {
          console.log('Invalid reward action, user not found');
          commentOnIssue(octokit, payload.repository.owner.login, payload.repository.name, payload.issue.number, generateInvalidUsernameComment(payload.repository.owner.login, reward[1]));
          return;
        }
      }
      catch (error: any) {
        if (error.response) {
          console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`);
        }
        console.error(error);
      }

      console.log(`Reward: ${reward}`);
      try {

        const trxnHash = await rewardBounty(payload.issue.html_url, reward[1]);

        if ( !trxnHash ) {
          console.log('Invalid reward action, bounty not found');
          commentOnIssue(octokit, payload.repository.owner.login, payload.repository.name, payload.issue.number, generateErrorMessage(payload.repository.owner.login));
          return;
        }

        // await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        //   owner: payload.repository.owner.login,
        //   repo: payload.repository.name,
        //   issue_number: payload.issue.number,
        //   body: `Congratulations, you have successfully rewarded @${reward[1]}.`,
        //   headers: {
        //     "x-github-api-version": "2022-11-28",
        //   },
        // });

        await commentOnIssue(octokit, payload.repository.owner.login, payload.repository.name, payload.issue.number, generateRewardNotification(reward[1], payload.repository.owner.login, trxnHash));

        await octokit.issues.update({
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          issue_number: payload.issue.number,
          assignees: [reward[1]],
          state: 'closed'
        });
      } catch (error: any) {
        if (error.response) {
          console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`);
        }
        console.error(error);
      }
    }
    if ( payload.comment.body.includes('/help') ) {
      console.log('Help action detected');
      commentOnIssue(octokit, payload.repository.owner.login, payload.repository.name, payload.issue.number, generateHelpNotification());
    }
  }
};

function generateRewardNotification(rewardee: string, maintainer: string, transactionHash: string): string {
  // Generate the message
  return `## 🎊 Congratulations, @${rewardee}! 🎊\n\n` +
    `Thank you for your fantastic contributions! Keep up the amazing work, and let’s continue making waves together! 🌊\n` +
    `Cheers,\n@${maintainer}\n\n`+
    `Transaction: [${transactionHash}](https://sepolia.basescan.org/tx/${transactionHash})`+
    `If you're a new user 🚀 Awesome news! Please register on Bounty Hub to get your reward amount!\n`+
    `If you're an existing user 🎁 Your reward has been successfully credited to your Bounty-Hub linked wallet!\n`+
    `🌟 **Visit [Bounty Hub](https://bounty-hub.vercel.app)** to participate in many more such bounties!\n\n`;
}

function generateHelpNotification(): string {
  return `## 🛠️ Bounty Hub Command Help 🛠️\n\n` +
    `Hey Maintainer! Here’s a quick guide to the available commands that you can use to manage bounties effectively:\n\n` +
    `### Commands:\n\n` +
    `1. **/bounty <amount>ETH** - 🚀 This command blocks funds and creates a bounty on the smart contract. Ensure that there are enough available funds before proceeding.\n\n` +
    `2. **/reward @<username>** - 🎉 This command awards the bounty to the specified user and closes the issue. Use this once the work is done and you're ready to reward the contributor.\n\n` +
    `3. **/help** - ℹ️ This command displays all available commands and keeps you updated with the latest features and capabilities.\n\n` +
    `4. **/remove** (coming soon) - 🧹 This command will remove the bounty and unblock the reserved funds. Stay tuned for updates!\n\n` +
    `Feel free to use these commands to manage bounties efficiently. If you need further assistance, don't hesitate to ask. Happy bounty hunting! 🏆`;
}

function generateErrorMessage(maintainer: string): string {
  return `## ⚠️ Oops, something went wrong! ⚠️\n\n` +
         `Hey @${maintainer}, it looks like the bounty couldn’t be processed successfully. Here are a few things you can check:\n\n` +
         `- 📡 **Blockchain communication issue**: There might be a temporary issue communicating with the blockchain. Please try again in a few moments.\n` +
         `- 💰 **Insufficient funds**: Make sure there are enough funds available in the bounty contract for this issue.\n` +
         `- ❌ **Issue not listed as a bounty**: If this issue wasn’t assigned a bounty, the reward can’t be processed.\n\n` +
         `If none of these seem to be the problem, it’s possible that we’re experiencing a temporary outage. Please hang tight and try again later! 🙏\n\n` +
         `Thank you for your patience! Let’s get things back on track soon. 💪`;
}

function generateInvalidUsernameComment(maintainer: string, username: string): string {
  return `## ❌ Invalid Reward Action ❌\n\n` +
         `Hey @${maintainer}, the reward couldn't be processed because the username **@${username}** was not found. 😕\n\n` +
         `Please double-check the username and try again to ensure it matches the correct GitHub account or the contributor who worked on this issue.\n\n` +
         `Let's fix this and reward the right person! 💪`;
}

function generateInvalidFundInputComment(maintainer: string, amount: string): string {
  return `## ⚠️ Invalid Bounty Command ⚠️\n\n` +
         `Hey @${maintainer}, it looks like the **/bounty** command failed because the input amount is invalid. 😕\n\n` +
         `Please ensure the amount is a valid number and formatted correctly (e.g., **/bounty 0.5ETH**).\n\n` +
         `Double-check the input and try again. Let’s get that bounty set up and bring in top contributors! 💪`;
}

function generateBountyCreatedMessage(maintainer: string, amount: string, transactionHash: string): string {
  return `## 🎉 Congratulations! 🎉\n\n` +
         `Hey @${maintainer}, the bounty of **${amount}ETH** has been successfully created! 💰\n\n` +
         `You're all set! Contributors can now start working on this issue. Let's attract the best talent to get it solved! 🚀\n\n` +
         `🔗 **Transaction**: [${transactionHash}](https://sepolia.basescan.org/tx/${transactionHash})\n\n` +
         `🌟 **Visit [Bounty Hub](https://bounty-hub.vercel.app)** to manage all your bounties easily!\n\n` +
         `Feel free to reach out if you need any assistance. Let’s get some awesome contributions rolling in! 💪`;
}