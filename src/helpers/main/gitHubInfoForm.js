import React from 'react'
import { Button, Input, Icon } from 'semantic-ui-react'
import instructionsHandler from '../../functionalComponents/handlers/instructionsHandler'

export default function gitHubInfoForm(apiFormHandler){
  
  return(
    <form id="github-info-form" name="github-info-form" class="animated fadeInRight">
      <label>GitHub Username & Access Token</label>
      <label></label>
      <div className="info-form-text">
        <Input focus className="input" placeholder='githubUser1' name="user" onKeyUp={(event)=> apiFormHandler(event)}></Input>
      </div>
      <div className="info-form-text">
        <Input focus className="input" placeholder="8a01a5bd1fd6e4cc" name="token" onKeyUp={(event)=> apiFormHandler(event)}></Input>
      </div>
      <p id="gen-actions"> <a href="https://github.com/settings/tokens" target="_blank" id="gen-token">Generate Access Token </a> | <a id="confused" onClick={()=> instructionsHandler()}>How To?</a></p>
      <br></br>
      <Button animated className="huge ui blue button" name="submit" onClick={(event)=> apiFormHandler(event)}>
        <Button.Content visible>Generate Repo List</Button.Content>
        <Button.Content hidden>
          <Icon name='large folder open' />
        </Button.Content>
      </Button>
    </form>
  )
}
