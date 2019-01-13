import React, {Component, Fragment} from 'react'
import $ from 'jquery';
import { Button, Input, Icon } from 'semantic-ui-react'
import Popup from 'react-popup';
import repoMapper from '../functionalComponents/repoMapper'
import saveRepoMapper from '../functionalComponents/saveRepoMapper'
import fetchRepos from '../functionalComponents/fetchRepos'
import deleteRepos from '../functionalComponents/deleteRepos'


const axios = require('axios');
const fs = require('browserify-fs');
const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: 20,
  shiftY: 10
}

export default class ApiComponent extends Component{
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

  componentDidMount(){
    fetchRepos(this.props.user, this.props.token, this.fetchStateSetter)
  }


  fetchStateSetter = (unforkedRepositories, forkedRepositories, allRepos) => {
    this.setState({
      unforkedRepos: unforkedRepositories,
      forkedRepos: forkedRepositories,
      reposToDelete: allRepos,
      reposLoaded: true
    })
  }

  searchHandler = (event) => {
    this.setState({
      searchTerm: event.target.value
    })
  }

  checkHandler = (event) => {
    let savedRepos = this.state.reposToSave
      const updatedRepos = this.state.reposToDelete.filter(repo => {
        if(repo.id === parseInt(event.target.name)){
          savedRepos.push(repo)
        }
        return repo.id !== parseInt(event.target.name)
      })
      this.setState({
        reposToDelete: updatedRepos,
        reposToSave: savedRepos
      })
    }

  uncheckHandler = (event) => {
    let unsavedRepo
    const updatedRepos = this.state.reposToSave.filter(repo => {
      if(repo.id === parseInt(event.target.name)){
        unsavedRepo = repo
      }
      return repo.id !== parseInt(event.target.name)
    })
    this.setState({
      reposToDelete: [...this.state.reposToDelete, unsavedRepo],
      reposToSave: updatedRepos
    }, () => console.log(this.state))
  }

  buttonHandler = () => {
    this.state.button === 'all' ? this.renderForkedButton() : this.renderAllButton()
  }
  renderForkedButton = () => {
    return (
      <Button className="ui teal button" onClick={() => this.forkButtonHandler()} >Want Only Forked Repos?</Button>
    )
  }
  renderAllButton = () => {
    return (
      <Button className="ui teal button" onClick={() => this.allButtonHandler()} >Reset</Button>
    )
  }

  forkButtonHandler = () => {
      this.setState({
        reposToDelete: this.state.forkedRepos,
        reposToSave: this.state.unforkedRepos,
        displayForked: true
      })
    }

  allButtonHandler = () => {
    this.setState({
      reposToDelete: [...this.state.forkedRepos, ...this.state.unforkedRepos],
      displayForked: false,
      reposToSave: []
    })
  }


  render(){
    return(
      <div>
        <div>
        <div className="searchDiv">
          <Input focus className="search-bar" placeholder="search repositories" onChange={(event) => this.searchHandler(event)}></Input>
        </div>
        <div className="buttonDiv">
          {this.state.displayForked ? this.renderAllButton() : this.renderForkedButton()}
          <Button animated className="red button button " onClick={() => deleteRepos(this.props.user, this.props.token, this.state.reposToDelete, this.props.resetState)}>
            <Button.Content className="delete-button " visible>Delete Repos</Button.Content>
            <Button.Content hidden>
              <Icon name='trash alternate' />
            </Button.Content>
          </Button>
        </div>
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
                {this.state.reposLoaded ? repoMapper(this.state.reposToDelete, this.state.searchTerm, this.checkHandler) : null}
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
                {this.state.reposToSave.length > 0 ? saveRepoMapper(this.state.reposToSave, this.state.searchTerm, this.uncheckHandler) : null}
              </tbody>
            </table>
          </div>
        </div>
       </div>
      </div>
    )
  }

}
