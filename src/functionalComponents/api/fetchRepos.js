import Popup from 'react-popup';

const GITHUB_PAGE_LIMIT = 75;
const getReposEndpoint = `GET /user/repos?affiliation=owner`

/**
 * Recursively paginate through the request
 */
const getRecursively = async (octokit, items = [], page = 1, username) => {
  // Wait between paginations for rate limiting
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 25)
  })

  // Get repos
  const res = await octokit.request(getReposEndpoint, {
    per_page: GITHUB_PAGE_LIMIT,
    page,
  });
  
  // Filter to repos that can be deleted
  const myReposOnly = res.data.filter(r => r.owner.login === username);

  // Spread in previous request repos
  const accumulatedRes = [ ...items, ...myReposOnly ];

  // If the request is the page limit, try to get the next page
  if (res.data.length === GITHUB_PAGE_LIMIT) {
    return getRecursively(octokit, accumulatedRes, page + 1, username);
  }

  // Return all repos
  return accumulatedRes;
}

async function fetchRepos(octokit, username) {
  // Paginate through the API and get all of the repos
  const repos = await getRecursively(octokit, [], 1, username).catch(e => {
    Popup.alert('Oops, something went wrong! Try another token if this doesn`t work again.');
  });

  return repos;
}

export default fetchRepos
