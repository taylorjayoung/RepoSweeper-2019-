import React from 'react'
import Popup from 'react-popup';
import { Button, Input, Icon } from 'semantic-ui-react'

function homeButton(clickHandler){
  return(
    <div class="animated fadeInRight">
      <h1 id="app-title">RepoSweeper</h1>
      <div>
        <Button size="huge" animated onClick={() => clickHandler()}>
          <Button.Content visible>Clean Up My Repos</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow right' />
          </Button.Content>
        </Button>
      </div>
   </div>
 )
}

export default homeButton
