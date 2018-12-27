import React, {Component, Fragment} from 'react'
import $ from 'jquery';
import { Button, Input, Icon } from 'semantic-ui-react'
import Popup from 'react-popup';
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
    reposToSave: []
  }

  componentDidMount(){
    this.fetchRepos(this.props.user, this.props.token)
  }

  async fetchRepos(user, token) {
    const username = user;
    const URL = `https://api.github.com/users/${user}/repos`;
    let apiRepos = [];
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
          const repo = res.data
          console.log(
            `[Page ${page}] Found ${apiRepos.length} forked repo(s) out of ${
              res.data.length
            }:`,

          );
          apiRepos.push(...repo);
          page++;
        })
        .catch(err => {
          console.error(`Error fetching page ${page}: ${err}`);
          stopFinding = true;
        }, () => Popup.alert('Oops, something went wrong! Try another token if this doesn`t work again.'));
    }
    this.setState({
      unforkedRepos: apiRepos.filter(repo => repo.fork === false),
      forkedRepos: apiRepos.filter(repo => repo.fork === true),
      reposToDelete: apiRepos
    }, () => console.log(this.state))
  }

  searchHandler = (event) => {
    this.setState({
      searchTerm: event.target.value
    })
  }


repoMapper = (forkedRepos, unforkedRepos) => {
    let repoList = this.state.reposToDelete
    if(this.state.searchTerm.length !== 0 ){
      repoList = repoList.filter(repo => {
        return repo.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()) || repo.description.toLowerCase().includes(this.state.searchTerm.toLowerCase())
      })
    }
    return repoList.map(repo => {
      debugger
      return (<tr scope="row" key={repo.id} className="table-row">
        <td>{repo.id}</td>
        <td>{repo.name}</td>
        <td>{repo.description}</td>
        <td>{repo.fork.toString()}</td>
        <td>{new Date(repo.created_at).toString().slice(0, 15)}</td>
        <td>{new Date(repo.updated_at).toString().slice(0, 15)}</td>
        <td><input type="checkbox" name={repo.id} onClick={event => this.checkHandler(event)} />&nbsp;</td>
      </tr>)
    })
  }

saveRepoMapper = repos => {
    let savedRepoList = this.state.reposToSave

    if(this.state.searchTerm.length !== 0 && savedRepoList.length > 0){
      savedRepoList = savedRepoList.filter(repo => {
        return repo.name.includes(this.state.searchTerm) || repo.description.includes(this.state.searchTerm)
      })
    }

    if(savedRepoList[0] === undefined || repos.length === 0){
      return
    }
    else {
      return savedRepoList.map(repo => {
        return (<tr scope="row" key={repo.id} className="table-row">
          <td>{repo.id}</td>
          <td>{repo.name}</td>
          <td>{repo.description}</td>
          <td>{repo.fork.toString()}</td>
          <td>{new Date(repo.created_at).toString().slice(0, 15)}</td>
          <td>{new Date(repo.updated_at).toString().slice(0, 15)}</td>
          <td><input type="checkbox" name={repo.id} onClick={event => this.uncheckHandler(event)} />&nbsp;</td>
        </tr>)
      })
    }
  }

  checkHandler = (event) => {
    let savedRepos = this.state.reposToSave
      //This filter function returns all repos that do not match the clicked repo.id
      //It also sets the constant savedRepo to the repo that DOES match the clicked repo.id
      //Finally it updates the state
      const updatedRepos = this.state.reposToDelete.filter(repo => {
        if(repo.id === parseInt(event.target.name)){
          savedRepos.push(repo)
        }
        return repo.id !== parseInt(event.target.name)
      })
      this.setState({
        reposToDelete: updatedRepos,
        reposToSave: savedRepos
      },() => console.log('updated saved', this.state.reposToSave))
    }
    // else {
    //   const updatedRepos = this.state.forkedRepos.filter(repo => {
    //     if(repo.id === parseInt(event.target.name)){
    //       savedRepo = repo
    //     }
    //     return repo.id !== parseInt(event.target.name)
    //   })
    //   this.setState({
    //     forkedRepos: updatedRepos,
    //     savedForkedRepos: [...this.state.savedForkedRepos, savedRepo]
    //   })
    // }


  // }

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

  deleteRepos = (user, token ) => {
   let repos = this.state.reposToDelete
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
         Popup.alert('Your repos have been swept! Congratulations! If you want to check your repos, generate a new token or wait 5 minutes!');
       })
       .catch(() => {
         console.error(`Error deleting ${repo.name}...`);
       });
   });
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
          <Button animated className="red button button " onClick={() => this.deleteRepos(this.props.user, this.props.token)}>
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
                {this.state.unforkedRepos ? this.repoMapper(this.state.reposToDelete) : null}
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
                {this.state.reposToSave.length > 0 ? this.saveRepoMapper(this.state.reposToSave) : null}
              </tbody>
            </table>
          </div>
        </div>
       </div>
      </div>
    )
  }

}
