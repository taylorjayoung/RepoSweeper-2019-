import React from 'react'
import Popup from 'react-popup';
const axios = require('axios');
const fs = require('browserify-fs');

function deleteRepos(user, token, repositories, resetStateFunction){
 let repos = repositories
 repos.forEach(async repo => {
   const URL = `https://api.github.com/repos/${repo.full_name}`;
   await axios({
     method: 'delete',
     url: URL,
     params: {
       access_token: token,
     },
   })
     .then(() => {
       resetStateFunction();
     })
     .then(() => {
       Popup.alert('Your repos have been swept! Congratulations! If you want to check your repos, generate a new token or wait 5 minutes!');
     })
     .catch(() => {
       console.error(`Error deleting ${repo.name}...`);
     });
 });
}

export default deleteRepos
