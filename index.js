const {Toolkit} = require("actions-toolkit");
const fetch = require("node-fetch");
const httpError = require("http-errors");

const updateStatus = ({
  state,
  description,
  targetURL,
  context,
  repo,
  owner,
  sha,
  token
}) =>
  fetch(`https://api.github.com/v3/repos/${owner}/${repo}/statuses/${sha}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      state,
      description,
      context,
      target_url: targetURL
    })
  });

const VALID_STATES = ["pending", "success", "error", "failure"];

Toolkit.run(
  async tools => {
    try {
      const argsList = tools.arguments._;
      if (argsList.length < 2)
        throw new Error("Invalid usage: requires context and state arguments");

      const state = argsList[1];
      if (!VALID_STATES.includes(state))
        throw new Error(
          `Invalid state argument: must be one of ${VALID_STATES}`
        );

      const args = {
        context: argsList[0],
        state,
        description: "A wild action appeared",
        targetURL: "https://bit.ly/4kb77v",
        repo: tools.context.repo.repo,
        owner: tools.context.repo.owner,
        sha: tools.context.sha
      };
      tools.log("Payload:");
      tools.log(args);

      const response = await updateStatus({...args, token: tools.token});
      tools.log.success("Got response:");
      tools.log.success(response);
      if (!response.ok) throw httpError(response.status);
      tools.exit.success("Status updated");
    } catch (error) {
      tools.exit.failure(error);
    }
  },
  {secrets: ["GITHUB_TOKEN"]}
);
