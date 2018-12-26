import React, { Component, Fragment } from 'react';
import './App.css';
import ApiComponent from './components/ApiComponent'
import { Button, Input, Icon } from 'semantic-ui-react'
import Popup from 'react-popup';

class App extends Component {
  state = {
    on_home: true,
    display_form: false,
    display_api: false,
    token: null,
    user: null
  }


  //token generator https://github.com/settings/tokens/new
  displayHomeButton = () => {
    return(
      <>
      <h1 id="app-title">RepoSweeper</h1>
      <div>
      <Button animated onClick={() => this.homeButtonClickHandler()}>
        <Button.Content visible>Clean Up My Repos</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow right' />
        </Button.Content>
      </Button>
     </div>
     < />
   )
  }

  homeButtonClickHandler = () => {
    this.setState({
      on_home: false,
      display_form: true
    })
  }

  instructionsHandler = () => {
    Popup.alert('Clicking the "generate access token" link below will bring you to GitHubs token generator page. Once there, click "Generate new token" on the top right of the screen.');
    Popup.alert('Select "public_repo" and "delete_repo" from the listed options. Then, click "Generate token" and paste the generated token in the input field below.');
    Popup.alert('Submit. You will have the opportunity to choose which repos you want to save and delete after you hit "Generate Repo List"');
  }


  renderGitHubInfoForm = () => {
    return(

      <form id= "github-info-form" name="github-info-form" >
        <div className="info-form-text">
        GitHub Username <Input focus className= "input" placeholder="githubuser1" name="user"></Input>
        </div>
        <br></br>
        <div className="info-form-text">
        Access Token <Input focus className= "input" placeholder="8a01a5bd1fd6e4cc" name="token"></Input>
        <p> <a href="https://github.com/settings/tokens" target="_blank">generate access token </a> | <a id="confused" onClick={() => this.instructionsHandler()}>confused?</a></p>
        </div>
        <br></br>
          <Button animated className="large ui button" onClick={(event) => this.generateApi(event)}>
            <Button.Content visible>Generate Repo List</Button.Content>
            <Button.Content hidden>
              <Icon name='large folder open' />
            </Button.Content>
          </Button>
      </form>
    )
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

          {this.state.on_home ? this.displayHomeButton() : null}
          {this.state.display_form ? this.renderGitHubInfoForm() : null}
          {this.state.display_api ? <ApiComponent token={this.state.token} user={this.state.user} resetState={this.resetState}/> : null}
          </header>
        </div>
    );
  }
}

export default App;
