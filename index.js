const {Toolkit} = require("actions-toolkit");
const fetch = require("node-fetch");

const updateStatus = ({
  state,
  description,
  targetURL,
  context,
  repo,
  sha,
  token
}) =>
  fetch(`https://api.github.com/repos/${repo}/statuses/${sha}`, {
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

Toolkit.run(
  async tools => {
    tools.log("arguments", tools.arguments);
    const argsList = tools.arguments._;
    if (argsList.length < 2) {
      tools.exit.failure("Invalid usage: requires context and state arguments");
      return;
    }
    const response = await updateStatus({
      context: argsList[0],
      state: argsList[1],
      description: "A wild action appeared",
      targetURL: "https://bit.ly/4kb77v",
      repo: tools.context.repo,
      sha: tools.context.sha,
      token: tools.token
    });
    tools.exit.success("We did it!");
  },
  {secrets: ["GITHUB_TOKEN"]}
);
