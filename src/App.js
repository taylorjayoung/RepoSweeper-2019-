import React, { Component, Fragment } from 'react';
import './index.css';
import ApiComponent from './components/ApiComponent'
import homeButton from './functionalComponents/homeButton'
import gitHubInfoForm from './functionalComponents/gitHubInfoForm'
import instructionsHandler from './functionalComponents/instructionsHandler'
   import {homeButtonClickHandler, generateApi, resetState} from './helpers/helperFunctions.js'
   import EnhancedTable from './functionalComponents/materialUITable'
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
          // {this.state.on_home ? homeButton(this.homeButtonClickHandler) : null}
          {this.state.on_home ? <EnhancedTable /> : null}
          {this.state.display_form ? gitHubInfoForm(this.generateApi) : null}
          {this.state.display_api ? <ApiComponent token={this.state.token} user={this.state.user} resetState={this.resetState}/> : null}
        </header>
    );
  }
}

export default App;
