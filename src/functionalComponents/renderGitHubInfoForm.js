import React from 'react'
import { Button, Input, Icon } from 'semantic-ui-react'

export default function renderGitHubInfoForm(generateApi){
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
        <Button animated className="large ui button" onClick={(event) => generateApi(event)}>
          <Button.Content visible>Generate Repo List</Button.Content>
          <Button.Content hidden>
            <Icon name='large folder open' />
          </Button.Content>
        </Button>
    </form>
  )
}
