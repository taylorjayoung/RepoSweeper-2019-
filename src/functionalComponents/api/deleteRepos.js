import Popup from 'react-popup';
import axios from 'axios';

const deleteRepoEndpoint = 'DELETE /repos/{owner}/{repo}'

async function deleteFromGit(octokit, repos) {
  return Promise.all(repos.map(async repo => {
    if (!repo.owner || !repo.name) {
      return
    }

    const args = {
      owner: repo.owner,
      repo: repo.name,
    }
    
    const res = await octokit.request(deleteRepoEndpoint, args).catch(e => {
      console.error(`Error deleting ${repo.name}... ${e.message}, ${e}`);
      return;
    })

    // Success case
    if (res && res.status === 204) {
      return repo
    }
  }))
}

export async function saveStats(deletedRepos) {
  await axios.post('https://hx60s1mgyd.execute-api.us-east-1.amazonaws.com/user/stats', {
    deletes: deletedRepos.length, // Number of repos deleted
    githubUsername: deletedRepos[0].owner, // All repos to be deleted are owned by the user actioning the delete
  });
}

const closePopUp = () => Popup.close();
  
function deleteRepos(octokit, repos, resetState){
  // confirmation popup
  Popup.create({
    title: null,
    content: `By clicking Confirm you are permanently deleting the previously selected repositories ${repos.map(r => r.name).join(' | ')} `,
    buttons: {
      left: [{
        text: 'Cancel',
        action: () => closePopUp()
      }],
      right: [{
        text: 'Confirm',
        className: 'danger',
        action: async () => {
          closePopUp()

          // Delete the repos in Github
          const deletedRepos = await deleteFromGit(octokit, repos)

          // Save the delete stats to the RepoSweeper backend
          if (deletedRepos.length) {
            saveStats(deletedRepos);
          }

          resetState();
          Popup.alert(`
            The following repos have been deleted:
            
            ${deletedRepos.filter(repo => !!repo).map(r => r.name).join(' | ')}!
            
            If you want to check your repos, generate a new token or wait 5 minutes!`);
        }
      }]
    }
  });
}

export default deleteRepos
