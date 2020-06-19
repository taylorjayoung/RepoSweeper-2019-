import React, {Component, Fragment} from 'react'
import $ from 'jquery';
import { Button, Input, Icon } from 'semantic-ui-react'
import Popup from 'react-popup';
import repoMapper from '../../helpers/api/repoMapper'
import saveRepoMapper from '../../helpers/api/saveRepoMapper'
import fetchRepos from '../../functionalComponents/api/fetchRepos'
import deleteRepos from '../../functionalComponents/api/deleteRepos'
import searchHandler from '../../helpers/api/helperFunctions.js'
import checkHandler from '../../helpers/api/helperFunctions.js'
import uncheckHandler from '../../helpers/api/helperFunctions.js'
import buttonHandler from '../../helpers/api/helperFunctions.js'
import forkButtonHandler from '../../helpers/api/helperFunctions.js'
import allButtonHandler from '../../helpers/api/helperFunctions.js'
import MaterialUITable from '../../functionalComponents/table/materialUITable.js'

const axios = require('axios');
const fs = require('browserify-fs');
const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: 20,
  shiftY: 10
}

export default class ApiMainWrapper extends Component{
  state = {
    searchTerm: '',
    reposLoaded: false
  }


  searchHandler = searchHandler.bind(this)
  checkHandler = checkHandler.bind(this)
  uncheckHandler = uncheckHandler.bind(this)
  buttonHandler = buttonHandler.bind(this)
  forkButtonHandler = forkButtonHandler.bind(this)
  allButtonHandler = allButtonHandler.bind(this)
  stateSetter = this.stateSetter.bind(this)

  componentDidMount(){
    fetchRepos(this.props.user, this.props.token, this.stateSetter)
  }

 stateSetter(unforkedRepositories, forkedRepositories, allRepos){
      this.setState({
        repos: allRepos,
        reposLoaded: true
      }, () => {console.log(`set state in fetch setter`)})
  }


  render(){
    const { user, token, resetState } = this.props
    const { repos, searchTerm, reposLoaded } = this.state
    const { renderAllButton, renderForkedButton, searchHandler, checkHandler } = this
    return(
        <div class="animated fadeInRight">
          <div className="searchDiv">
            <Input focus className="search-bar" placeholder="search repositories" style={{width: "25vw"}} onChange={(event)=> searchHandler(event)}></Input>
            <div className="search-buttons">
            <Button animated className="red button delete-button" onClick={()=> deleteRepos(user, token, repos, resetState)}>
              <Button.Content visible>Delete Repos</Button.Content>
              <Button.Content hidden>
                <Icon name='trash alternate' />
              </Button.Content>
            </Button>
            </div>
          </div>
            <br/>
          <div id="table-div">
            <div id="new-table">
              {reposLoaded ? <MaterialUITable repos={repos} /> : null}
            </div>
          </div>
        </div>
    )
  }

}
