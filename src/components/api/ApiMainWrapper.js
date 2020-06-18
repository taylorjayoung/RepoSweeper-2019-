import React, {Component, Fragment} from 'react'
import $ from 'jquery';
import { Button, Input, Icon } from 'semantic-ui-react'
import Popup from 'react-popup';
import repoMapper from '../../helpers/api/repoMapper'
import saveRepoMapper from '../../helpers/api/saveRepoMapper'
import fetchRepos from '../../functionalComponents/api/fetchRepos'
import deleteRepos from '../../functionalComponents/api/deleteRepos'
import fetchStateSetter from '../../helpers/api/helperFunctions.js'
import searchHandler from '../../helpers/api/helperFunctions.js'
import checkHandler from '../../helpers/api/helperFunctions.js'
import uncheckHandler from '../../helpers/api/helperFunctions.js'
import buttonHandler from '../../helpers/api/helperFunctions.js'
import forkButtonHandler from '../../helpers/api/helperFunctions.js'
import allButtonHandler from '../../helpers/api/helperFunctions.js'


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
    displayForked: false,
    button: 'all',
    savedUnforkedRepos: [],
    savedForkedRepos: [],
    reposToDelete: [],
    reposToSave: [],
    reposLoaded: false
  }

  fetchStateSetter = fetchStateSetter.bind(this)
  searchHandler = searchHandler.bind(this)
  checkHandler = checkHandler.bind(this)
  uncheckHandler = uncheckHandler.bind(this)
  buttonHandler = buttonHandler.bind(this)
  forkButtonHandler = forkButtonHandler.bind(this)
  allButtonHandler = allButtonHandler.bind(this)

  componentDidMount(){
    fetchRepos(this.props.user, this.props.token, this.fetchStateSetter)
  }

  renderForkedButton(){
    return (
      <Button className="ui blue button forked-button" onClick={() => this.forkButtonHandler()} >Want Only Forked Repos?</Button>
    )
  }
  renderAllButton(){
    return (
      <Button className="ui blue button forked-button" onClick={() => this.allButtonHandler()} >Reset</Button>
    )
  }



  render(){
    const { user, token, resetState } = this.props
    const { displayForked, reposToDelete, reposLoaded, searchTerm, reposToSave } = this.state
    const { renderAllButton, renderForkedButton, searchHandler, checkHandler} = this
    return(
        <div class="animated fadeInRight">
          <div className="searchDiv">
            <Input focus className="search-bar" placeholder="search repositories" style={{width: "25vw"}} onChange={(event)=> searchHandler(event)}></Input>
            <div className="search-buttons">
            { displayForked ? renderAllButton() : renderForkedButton()}
            <Button animated className="red button delete-button" onClick={()=> deleteRepos(user, token, reposToDelete, resetState)}>
              <Button.Content visible>Delete Repos</Button.Content>
              <Button.Content hidden>
                <Icon name='trash alternate' />
              </Button.Content>
            </Button>
            </div>
          </div>
            <br/>
          <div id="table-div">
            <div id="delete-repos-table-div">
              <table className="table table-striped table-bordered table-sm" cellspacing="0" width="100%" id="api-table">
                <caption id="delete-repos-table-caption">Repos To Delete</caption>
                <tbody>
                  <tr className="table-row">
                    <th scope="col" className="table-column">#</th>
                    <th scope="col" className="table-column">Repo Name</th>
                    <th scope="col" className="table-column">Description</th>
                    <th scope="col" className="table-column">Forked</th>
                    <th scope="col" className="table-column">Created Date</th>
                    <th scope="col" className="table-column">Updated Date</th>
                    <th scope="col" className="table-column">Save</th>
                  </tr>
                  {reposLoaded ? repoMapper(reposToDelete, searchTerm, checkHandler) : null}
                </tbody>
              </table>
            </div>
            <div id="save-repos-table-div">
              <table className="table table-striped table-bordered table-sm" cellspacing="0" width="100%" id="api-table">
                <caption id="save-repos-table-caption">Saved Repos</caption>
                <tbody>
                  <tr className="table-row">
                    <th scope="col" className="table-column">#</th>
                    <th scope="col" className="table-column">Repo Name</th>
                    <th scope="col" className="table-column">Description</th>
                    <th scope="col" className="table-column">Forked</th>
                    <th scope="col" className="table-column">Created Date</th>
                    <th scope="col" className="table-column">Updated Date</th>
                    <th scope="col" className="table-column">Delete</th>
                  </tr>
                  {reposToSave.length > 0 ? saveRepoMapper(reposToSave, searchTerm, uncheckHandler) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    )
  }

}
