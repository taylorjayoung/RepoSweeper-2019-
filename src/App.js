import React, { Component } from 'react';
import './index.css';
import ApiMainWrapper from './components/api/ApiMainWrapper'
import homeButton from './functionalComponents/handlers/homeButton'
import gitHubInfoForm from './helpers/main/gitHubInfoForm'
import fetchRepos from './functionalComponents/api/fetchRepos'
import repoMapper from './helpers/api/repoMapper'
import {homeButtonClickHandler, apiFormHandler, resetState} from './helpers/main/helperFunctions.js'
import Popup from 'react-popup';
import { getOctokit } from './helpers/api/git';

class App extends Component {
  state = {
    on_home: true,
    display_form: false,
    display_table: false,
    form_submitted: false,
    form_info: {},
    token: null,
    username: null,
    apiRepos: []
  }

  homeButtonClickHandler = homeButtonClickHandler.bind(this)
  apiFormHandler = apiFormHandler.bind(this)
  resetState = resetState.bind(this)

  async componentDidUpdate(){
    const { username, token, form_submitted } = this.state;

    const octokit = getOctokit(token);

    if (this.state.apiRepos.length === 0 && form_submitted) {
      const repos = await fetchRepos(octokit, username);

      if (!repos || !repos.length) {
        Popup.alert('Uh oh, we didn\'t find any repositories with those credentials. Please check the visibility of the repositories (public/private)! Try another token if this doesn`t work again. And check the spelling of your username.')
        this.setState({display_form: true, form_submitted: false})
        return;
      }

      const apiRepos = repoMapper(repos)

      this.setState({apiRepos, display_table: true})
    }
  }

  render() {
    const {display_form, display_table, apiRepos, username, token, on_home} = this.state
    const {resetState, apiFormHandler,homeButtonClickHandler} = this
    return (
        <header className="App">
          {on_home ? homeButton(homeButtonClickHandler) : null}
          {display_form ? gitHubInfoForm(apiFormHandler) : null}
          {display_table ? <ApiMainWrapper apiRepos={apiRepos} user={username} token={token} resetState={resetState}/> : null}
        </header>
    );
  }
}

export default App;
