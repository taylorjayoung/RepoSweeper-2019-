import React from 'react'
import Popup from 'react-popup';
const axios = require('axios');
const fs = require('browserify-fs');

function deleteRepos(user, token, repos, resetState){
  console.log('waiting for confirmation...')
  console.log(`token: ${token}`)
  console.log(`user: ${user}`)
//confirmation popup
 Popup.create({
     title: null,
     content: 'By clicking Confirm you are permanently deleting the previously selected repositories.',
     buttons: {
         left: [{
             text: 'Cancel',
             action: function () {
                  Popup.close()
             }
         }],
         right: [{
             text: 'Confirm',
             className: 'danger',
             action: function () {
               repos.forEach(async repo => {
                 const URL = `https://api.github.com/repos/${repo.full_name}`;
                 console.log(`url to delete: ${URL}`)
                 await axios({
                   method: 'delete',
                   url: URL,
                   headers: {
                     'Authorization': `token ${token}`
                   },
                 })
                   .then(() => Popup.close())
                   .then(() => {
                     resetState();
                   })
                   .then(() => {
                      Popup.alert(`The following repos have been deleted: ${repos.map( r => r.name)} ! If you want to check your repos, generate a new token or wait 5 minutes!`);
                   })
                   .catch((e) => {
                     console.error(`Error deleting ${repo.name}... ${e.message}, ${e}`);
                   });
               });
             }
         }]
     }
 });


}

export default deleteRepos
