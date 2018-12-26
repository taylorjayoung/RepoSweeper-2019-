import React, {Component} from 'react'
import $ from 'jquery';
import { Button, Input, Icon } from 'semantic-ui-react'
import Popup from 'react-popup';

const axios = require('axios');
const fs = require('browserify-fs');


export default class ApiComponent extends Component{
  state = {
    repos: null,
    searchTerm: ''
  }

  componentDidMount(){
    this.fetchRepos(this.props.user, this.props.token)
  }

  async fetchRepos(user, token) {
    const username = user;
    const URL = `https://api.github.com/users/${user}/repos`;
    const repos = [];
    let page = 1;
    let stopFinding = false;
    while (!stopFinding) {
      await axios
        .get(URL, {
          params: {
            page,
            access_token: token,
          },
        })
        .then(res => {
          if (res.data.length === 0) {
            stopFinding = true;
            return;
          }
          const forkedRepos = res.data
          console.log(
            `[Page ${page}] Found ${forkedRepos.length} forked repo(s) out of ${
              res.data.length
            }:`,

          );
          console.log(forkedRepos.join('\n') + '\n');
          repos.push(...forkedRepos);
          page++;
        })
        .catch(err => {
          console.error(`Error fetching page ${page}: ${err}`);
          stopFinding = true;
        }, () => Popup.alert('Oops, something went wrong! Try another token if this doesn`t work again.'));
    }
    this.setState({
      reposToBeDeleted: repos,
      savedRepos: []
    },() => console.log(this.state))
  }


  searchHandler = (event) => {
    this.setState({
      searchTerm: event.target.value
    })
  }


deleteRepoMapper = repos => {
    let repoList
    if(this.state.searchTerm.length !== 0 ){
      repoList = this.state.reposToBeDeleted.filter(repo => {
        return repo.name.includes(this.state.searchTerm)
      })
    }
    else { repoList = this.state.reposToBeDeleted}

    return repoList.map(repo => {
      return (<tr scope="row" key={repo.id} className="table-row">
        <td>{repo.id}</td>
        <td>{repo.name}</td>
        <td>{repo.description}</td>
        <td>{new Date(repo.created_at).toString().slice(0, 15)}</td>
        <td>{new Date(repo.updated_at).toString().slice(0, 15)}</td>
        <td><input type="checkbox" name={repo.id} onClick={event => this.checkHandler(event)} />&nbsp;</td>
      </tr>)
    })
  }
saveRepoMapper = repos => {
    let repoList
    if(this.state.searchTerm.length !== 0 ){
      repoList = this.state.savedRepos.filter(repo => {
        return repo.name.includes(this.state.searchTerm)
      })
    }
    else { repoList = this.state.savedRepos}

    return repoList.map(repo => {
      return (<tr scope="row" key={repo.id} className="table-row">
        <td>{repo.id}</td>
        <td>{repo.name}</td>
        <td>{repo.description}</td>
        <td>{new Date(repo.created_at).toString().slice(0, 15)}</td>
        <td>{new Date(repo.updated_at).toString().slice(0, 15)}</td>
        <td><input type="checkbox" name={repo.id} onClick={event => this.uncheckHandler(event)} />&nbsp;</td>
      </tr>)
    })
  }

  checkHandler = (event) => {
    let savedRepo
      //This filter function returns all repos that do not match the clicked repo.id
      //It also sets the constant savedRepo to the repo that DOES match the clicked repo.id
      //Finally it updates the state
      const updatedRepos = this.state.reposToBeDeleted.filter(repo => {
        if(repo.id === parseInt(event.target.name)){
          savedRepo = repo
        }
        return repo.id !== parseInt(event.target.name)
      })
      this.setState({
        reposToBeDeleted: updatedRepos,
        savedRepos: [...this.state.savedRepos, savedRepo]
      })
  }

  uncheckHandler = (event) => {
    let unsavedRepo
    const updatedSavedRepos = this.state.savedRepos.filter(repo => {
      if(repo.id === parseInt(event.target.name)){
        unsavedRepo = repo
      }
      return repo.id !== parseInt(event.target.name)
    })
    this.setState({
      reposToBeDeleted: [...this.state.reposToBeDeleted, unsavedRepo],
      savedRepos: updatedSavedRepos
    })
  }

  deleteRepos = (repos, user, token ) => {
   repos.forEach(async repo => {
     const URL = `https://api.github.com/repos/${repo.full_name}`;
     await axios({
       method: 'delete',
       url: URL,
       params: {
         access_token: token,
       },
     })
       .then(() => {
         this.props.resetState();
       })
       .then(() => {
         Popup.alert('Your repos have been swept! Congratulations! If you want to check your repos, generate a new token!');
       })
       .catch(() => {
         console.error(`Error deleting ${repo.name}...`);
       });
   });
 }

  render(){
    return(
      <div>
        <div>
          <Input focus className="search-bar" placeholder="search repositories" onChange={(event) => this.searchHandler(event)}></Input>
          <Button animated onClick={() => this.deleteRepos(this.state.reposToBeDeleted, this.props.user, this.props.token)}>
            <Button.Content className="delete-button" visible>Delete Repos</Button.Content>
            <Button.Content hidden>
              <Icon name='trash alternate' />
            </Button.Content>
          </Button>
          <div id="delete-repos-table-div">
            <table className="table table-striped table-bordered table-sm" cellspacing="0" width="100%" id="api-table">
            <caption id="delete-repos-table-caption">Repos To Delete</caption>
              <tbody>
              <tr className="table-row">
                <th scope="col" className="table-column">#</th>
                <th scope="col" className="table-column">Repo Name</th>
                <th scope="col" className="table-column">Description</th>
                <th scope="col" className="table-column">Created Date</th>
                <th scope="col" className="table-column">Updated Date</th>
                <th scope="col" className="table-column">Save</th>
              </tr>
                {this.state.reposToBeDeleted ? this.deleteRepoMapper(this.state.repos) : null }
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
                <th scope="col" className="table-column">Created Date</th>
                <th scope="col" className="table-column">Updated Date</th>
                <th scope="col" className="table-column">Delete</th>
              </tr>
                {this.state.reposToBeDeleted ? this.saveRepoMapper(this.state.repos) : null }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

}
