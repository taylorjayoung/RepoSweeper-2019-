import { Octokit } from 'octokit';

export const getOctokit = (token) => {
  return new Octokit({ auth: token, request: { timeout: 1000 } });
}
