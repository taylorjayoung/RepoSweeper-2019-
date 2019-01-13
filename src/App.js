import React, { Component, Fragment } from 'react';
import './App.css';
import ApiComponent from './components/ApiComponent'
import homeButton from './functionalComponents/homeButton'
import renderGitHubInfoForm from './functionalComponents/renderGitHubInfoForm'
import instructionsHandler from './functionalComponents/instructionsHandler'

class App extends Component {
  state = {
    on_home: true,
    display_form: false,
    display_api: false,
    token: null,
    user: null
  }

  homeButtonClickHandler = () => {
    this.setState({
      on_home: false,
      display_form: true
    })
  }

  generateApi = event => {
    event.preventDefault()
    this.setState({
      token: document.forms["github-info-form"]["token"].value,
      user: document.forms["github-info-form"]["user"].value,
      display_form: false,
      display_api: true,
      on_home: false
    })
  }

  resetState = () => {
    this.setState({
      on_home: true,
      display_form: false,
      display_api: false,
      token: null,
      user: null
    })
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
          {this.state.on_home ? homeButton(this.homeButtonClickHandler) : null}
          {this.state.display_form ? renderGitHubInfoForm(this.generateApi) : null}
          {this.state.display_api ? <ApiComponent token={this.state.token} user={this.state.user} resetState={this.resetState}/> : null}
          </header>
        </div>
    );
  }
}

export default App;
