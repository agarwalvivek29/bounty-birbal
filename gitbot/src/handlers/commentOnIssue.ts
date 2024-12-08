import { Octokit } from "octokit";

export async function commentOnIssue(octokit: Octokit, owner: string, repo: string, issue_number: number, body: string) {
    try {
      await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        owner,
        repo,
        issue_number,
        body,
        headers: {
          "x-github-api-version": "2022-11-28",
        },
      });
    }
    catch (error: any) {
      if (error.response) {
        console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`);
      }
      console.error(error);
    }
  }