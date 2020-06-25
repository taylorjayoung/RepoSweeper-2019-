import React, { Component, Fragment } from 'react';
import './index.css';
import ApiMainWrapper from './components/api/ApiMainWrapper'
import homeButton from './functionalComponents/handlers/homeButton'
import gitHubInfoForm from './helpers/main/gitHubInfoForm'
import fetchRepos from './functionalComponents/api/fetchRepos'
import repoMapper from './helpers/api/repoMapper'
   import {homeButtonClickHandler, apiFormHandler, resetState} from './helpers/main/helperFunctions.js'

class App extends Component {
  state = {
    on_home: true,
    display_form: false,
    display_table: false,
    form_submitted: false,
    form_info: {},
    token: null,
    user: null,
    apiRepos: []
  }

  homeButtonClickHandler = homeButtonClickHandler.bind(this)
  apiFormHandler = apiFormHandler.bind(this)
  resetState = resetState.bind(this)

  componentDidMount(){
    if(this.state.form_submitted){
      fetchRepos(this.user, this.token)
      .then( result => {
        const apiRepos = repoMapper(result)
        this.setState({apiRepos})
      })
    }
  }




  render() {
    return (
        <header className="App">
          {this.state.on_home ? homeButton(this.homeButtonClickHandler) : null}
          {this.state.display_form ? gitHubInfoForm(this.apiFormHandler) : null}
          {this.state.display_table ? <ApiMainWrapper token={this.state.token} user={this.state.user} resetState={this.resetState}/> : null}
        </header>
    );
  }
}

export default App;
