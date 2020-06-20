import React from 'react'
import Popup from 'react-popup';
const axios = require('axios');
const fs = require('browserify-fs');

async function fetchRepos(user, token, setStateFunction){
  const username = user;
  const URL = `https://api.github.com/users/${user}/repos`;
  let apiRepos = [];
  let page = 1;
  let stopFinding = false;
  while (!stopFinding) {
    await axios
      .get(URL, {
        params: {
          page,
          access_token: token,
        },
      })
      .then(res => {
        if (res.data.length === 0) {
          stopFinding = true;
          return;
        }
        const repo = res.data
        console.log(
          `[Page ${page}] Found ${apiRepos.length} forked repo(s) out of ${
            res.data.length
          }:`,

        );
        apiRepos.push(...repo);
        page++;
      })
      .catch(err => {
        console.error(`Error fetching page ${page}: ${err}`);
        stopFinding = true;
      }, () => Popup.alert('Oops, something went wrong! Try another token if this doesn`t work again.'));
  }


  return apiRepos
}

export default fetchRepos
