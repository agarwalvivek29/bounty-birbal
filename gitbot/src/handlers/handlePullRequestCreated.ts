import { Octokit } from "@octokit/rest";

export const handlePullRequestOpened = async ({octokit, payload }: any) => {
    console.log(`Received an pull request opened event by #${payload.pull_request.number}`);

    const message = await evaluatePullRequest(payload.pull_request.html_url, "Ensure the code follows best practices for API error handling.");

    try {
        await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            issue_number: payload.pull_request.number,
            body: JSON.stringify(message),
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

interface EvaluationResponse {
  syntax_check: string | null;
  objective_check: string | null;
  cleanup: string | null;
  error?: string;
}

async function evaluatePullRequest(
  prUrl: string,
  objective: string
): Promise<EvaluationResponse> {
  // Parse the pull request URL
  const parsePrUrl = (url: string): { owner: string; repo: string; prNumber: number } => {
    const regex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
    const match = url.match(regex);
    if (!match) {
      throw new Error("Invalid pull request URL format");
    }
    const [, owner, repo, prNumber] = match;
    return { owner, repo, prNumber: parseInt(prNumber, 10) };
  };

  // Fetch pull request details using Octokit
  const fetchPrDetails = async (
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<{ codeChanges: Record<string, string>; title: string }> => {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const { data: prData } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
    });

    const codeChanges: Record<string, string> = {};
    files.forEach((file:any) => {
      if (file.patch) {
        codeChanges[file.filename] = file.patch;
      }
    });

    return { codeChanges, title: prData.title };
  };

  try {
    // Step 1: Parse the pull request URL
    const { owner, repo, prNumber } = parsePrUrl(prUrl);

    // Step 2: Fetch pull request details
    const { codeChanges, title } = await fetchPrDetails(owner, repo, prNumber);

    // Step 3: Combine code changes for evaluation
    const codeCombined = Object.keys(codeChanges)
      .map(([filename, changes]:any) => `File: ${filename}\nChanges:\n${changes}`)
      .join("\n\n");

    // Step 4: Generate the evaluation prompt
    const prompt = `
      You are provided with a pull request from GitHub. Evaluate the code in the pull request sequentially as follows:
      - **Pull Request URL**: ${prUrl}
      - **Title**: ${title}
      - **Objective**: ${objective}

      The pull request contains the following changes:
      ${codeCombined}

      Steps to evaluate:
      1. Syntax Check: Identify any syntax errors in the code changes. If there are no errors, return "OK". Otherwise, provide a detailed report of syntax errors in JSON format.
      2. Objective Satisfaction Check: Analyze the changes to determine if they meet the stated objectives. If they do, return "OK". Otherwise, provide a detailed report.
      3. Code Cleanup: Clean up the code by optimizing it for production, adding comments, type annotations, and error handling where necessary.

      Output the result as a structured JSON object:
      {
        "syntax_check": <syntax_check_output>,
        "objective_check": <objective_check_output>,
        "cleanup": <cleanup_output>
      }
    `;

    let simulatedResponse = {
        syntax_check: "OK",
        objective_check: "OK",
        cleanup: "Cleaned-up production-ready code with comments and error handling.",
    };

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-exp-1114:generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyBgT7JR1fB3DGPHdsGHQT8IJDaHbwXgU1M'
        },
        body: JSON.stringify({
            generationConfig: {},
            safetySettings: [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
            ],
            contents: [{
                role: "user"  ,
                content: prompt
            }]
        })
    });
    simulatedResponse = await response.json();

    return {
      syntax_check: simulatedResponse.syntax_check,
      objective_check: simulatedResponse.objective_check,
      cleanup: simulatedResponse.cleanup,
    };
  } catch (error) {
    return {
      syntax_check: null,
      objective_check: null,
      cleanup: null,
      error: (error as Error).message,
    };
  }
}
