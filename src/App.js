import React, { Component, Fragment } from 'react';
import './index.css';
import ApiMainWrapper from './components/api/ApiMainWrapper'
import homeButton from './functionalComponents/handlers/homeButton'
import gitHubInfoForm from './helpers/main/gitHubInfoForm'
import instructionsHandler from './functionalComponents/handlers/instructionsHandler'
   import {homeButtonClickHandler, generateApi, resetState} from './helpers/main/helperFunctions.js'
   import EnhancedTable from './functionalComponents/table/materialUITable'
class App extends Component {
  state = {
    on_home: true,
    display_form: false,
    display_api: false,
    token: null,
    user: null
  }

  homeButtonClickHandler = homeButtonClickHandler.bind(this)
  generateApi = generateApi.bind(this)
  resetState = resetState.bind(this)





  render() {
    return (
        <header className="App">
          {this.state.on_home ? homeButton(this.homeButtonClickHandler) : null}
          {this.state.display_form ? gitHubInfoForm(this.generateApi) : null}
          {this.state.display_api ? <ApiMainWrapper token={this.state.token} user={this.state.user} resetState={this.resetState}/> : null}
        </header>
    );
  }
}

export default App;
