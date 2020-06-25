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
    submittedUsername: null,
    apiRepos: []
  }

  homeButtonClickHandler = homeButtonClickHandler.bind(this)
  apiFormHandler = apiFormHandler.bind(this)
  resetState = resetState.bind(this)

  componentDidUpdate(){
      if(this.state.apiRepos.length === 0 && this.state.form_submitted){
        fetchRepos(this.username, this.token)
        .then( result => {
          const apiRepos = repoMapper(result)

          console.log(`api repo resul in cdm: ${JSON.stringify(apiRepos)}`)
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
    return (
        <header className="App">
          {this.state.on_home ? homeButton(this.homeButtonClickHandler) : null}
          {this.state.display_form ? gitHubInfoForm(this.state.submittedUsername, this.apiFormHandler) : null}
          {this.state.display_table ? <ApiMainWrapper apiRepos={this.state.apiRepos} resetState={this.resetState}/> : null}
        </header>
    );
  }
}

export default App;
