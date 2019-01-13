import React from 'react'

export default function checkHandler(event, checkStateSetter){
  let savedRepos = this.state.reposToSave
    const updatedRepos = this.state.reposToDelete.filter(repo => {
      if(repo.id === parseInt(event.target.name)){
        savedRepos.push(repo)
      }
      return repo.id !== parseInt(event.target.name)
    })
    const deleteRepos = updatedRepos
    const saveRepos =savedRepos
    checkStateSetter(deleteRepos, saveRepos)
  }
