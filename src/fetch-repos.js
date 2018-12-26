import React, { Component } from 'react';

const axios = require('axios');
const fs = require('browserify-fs');
 

async function fetchRepos(user, url, token) {
  const username = user;
  const URL = `${url}/users/${user}/repos`;
  const repos = [];
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
        const forkedRepos = res.data
          .map(repo => repo.full_name), () =>
        console.log(
          `[Page ${page}] Found ${forkedRepos.length} forked repo(s) out of ${
            res.data.length
          }:`,
        );
        debugger
        console.log(forkedRepos.join('\n') + '\n');
        repos.push(...forkedRepos);
        page++;
      })
      .catch(err => {
        console.error(`Error fetching page ${page}: ${err}`);
        stopFinding = true;
      });
  }
  return repos;
}



export default fetchRepos
