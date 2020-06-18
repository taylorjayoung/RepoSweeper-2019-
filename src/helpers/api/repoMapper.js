import React from 'react'

export default function repoMapper(repos, searchterm, checkHandler){
    let repoList = repos
    if(searchterm.length !== 0 ){
      repoList = repoList.filter(repo => {
        if(repo.name && repo.description){
          if(repo.name.toLowerCase().includes(searchterm.toLowerCase()) || repo.description.toLowerCase().includes(searchterm.toLowerCase()))
          return repo
        }
        else if (repo.name && !repo.description){
          if(repo.name.toLowerCase().includes(searchterm.toLowerCase()))
          return repo
        }
        else if (!repo.name && repo.description){
          if(repo.description.toLowerCase().includes(searchterm.toLowerCase()))
          return repo
        }
      })
    }

      const rows = []

      return repoList.forEach(repo => {
        const currentRow = {
          id: repo.id ? repo.id : null,
          name: repo.name ? repo.name : null,
          description: repo.description ? repo.description: null,
          fork: repo.fork.toString() ? repo.fork.toString() : null,
          createdDate: new Date(repo.created_at).toString().slice(0, 15),
          updatedDate: new Date(repo.updated_at).toString().slice(0, 15),
        }
        rows.push(currentRow)
      })

      return rows
    }
