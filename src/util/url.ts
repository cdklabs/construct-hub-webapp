const gitSSHRegex = new RegExp(
  /git@github\.com:([a-zA-Z-]+)+\/?([a-zA-Z-]+)*(\.git)?/
);

export const getRepoUrlAndHost = (
  repoUrl: string
): { url: string; hostname: string } | undefined => {
  try {
    let url = repoUrl;

    const sshUrl = repoUrl.match(gitSSHRegex);

    if (sshUrl) {
      const [, author, repo] = sshUrl;

      url = `https://github.com/${author}/${repo}`;
    }

    return {
      hostname: new URL(url).hostname,
      url,
    };
  } catch {
    // Invalid URL, return undefined as a signal that we should not display it
    return undefined;
  }
};
