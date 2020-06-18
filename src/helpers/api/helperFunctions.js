export function fetchStateSetter(unforkedRepositories, forkedRepositories, allRepos){
  this.setState({
    unforkedRepos: unforkedRepositories,
    forkedRepos: forkedRepositories,
    reposToDelete: allRepos,
    reposLoaded: true
  })
}


export function searchHandler(event) {
  this.setState({
    searchTerm: event.target.value
  })
}

export function checkHandler(event) {
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

export function uncheckHandler(event){
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

export function buttonHandler(){
  this.state.button === 'all' ? this.renderForkedButton() : this.renderAllButton()
}

export function forkButtonHandler(){
    this.setState({
      reposToDelete: this.state.forkedRepos,
      reposToSave: this.state.unforkedRepos,
      displayForked: true
    })
  }

export default function allButtonHandler(){
  try{
    this.setState({
      reposToDelete: [...this.state.forkedRepos, ...this.state.unforkedRepos],
      displayForked: false,
      reposToSave: []
    })
  } catch(e){
    console.log(`broken... forked: ${this.state.forkedRepos}, unforked: ${this.state.unforkedRepos}`)
  }

}