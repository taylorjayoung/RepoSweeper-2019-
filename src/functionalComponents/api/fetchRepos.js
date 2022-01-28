import React from 'react'
import Popup from 'react-popup';

const axios = require('axios');
const fs = require('browserify-fs');

async function fetchRepos(user, token, setStateFunction){

  const URL = `https://api.github.com/users/${user}/repos`;
  console.log(`URL: ${URL}`)

  let apiRepos = [];
  let page = 1;
  let stopFinding = false;
  const axiosInstance = axios.create({
    baseURL: URL,
    timeout: 1000,
    responseType: "json",
    headers: {'Authorization': `Authorization: token ${token}`, Accept: "application/json" }
  });

  while (!stopFinding) {
    await axiosInstance
      .get(URL,{ 
        params: {
          page        
        },
      })
      .then(res => {
        if (res.data.length === 0) {
          stopFinding = true;
        }
        const repo = res.data
        console.log(
          `[Page ${page}] Found ${apiRepos.length} repo(s) out of ${
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
