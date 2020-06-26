import React, { Component, Fragment } from 'react';
import './index.css';
import ApiMainWrapper from './components/api/ApiMainWrapper'
import homeButton from './functionalComponents/handlers/homeButton'
import gitHubInfoForm from './helpers/main/gitHubInfoForm'
import fetchRepos from './functionalComponents/api/fetchRepos'
import repoMapper from './helpers/api/repoMapper'
   import {homeButtonClickHandler, apiFormHandler, resetState} from './helpers/main/helperFunctions.js'
   import Popup from 'react-popup';

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

  componentDidUpdate(){
      const {apiRepos, username, token } = this.state
      const {form_submitted} = this
      if(apiRepos.length === 0 && form_submitted){
        fetchRepos(username, token)
        .then( result => {
          const apiRepos = repoMapper(result)

          if(apiRepos.length === 0 || apiRepos.length === 1){
            if(apiRepos.length === 0 || apiRepos[0].full_name ==="undefined/undefined.github.io"){
              Popup.alert('Uh oh, we didn\'t find any repositories with those credentials. Please check the visibility of the repositories (public/private)! Try another token if this doesn`t work again. And check the spelling of your username.')
              this.setState({display_form: true, form_submitted: false})
            }
          }
            else {
            this.setState({apiRepos, display_table: true})
          }
      })
    }
  }




  render() {
    const {display_form, display_table, apiRepos, user, token, on_home} = this.state
    const {resetState, apiFormHandler,homeButtonClickHandler} = this
    return (
        <header className="App">
          {on_home ? homeButton(homeButtonClickHandler) : null}
          {display_form ? gitHubInfoForm(apiFormHandler) : null}
          {display_table ? <ApiMainWrapper apiRepos={apiRepos} user={user} token={token} resetState={resetState}/> : null}
        </header>
    );
  }
}

export default App;
