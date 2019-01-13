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
      return repoList.map(repo => {
        return (
          <tr scope="row" key={repo.id} className="table-row">
          <td>{repo.id ? repo.id : null}</td>
          <td>{repo.name ? repo.name : null}</td>
          <td>{repo.description ? repo.description: null}</td>
          <td>{repo.fork.toString() ? repo.fork.toString() : null }</td>
          <td>{new Date(repo.created_at).toString().slice(0, 15)}</td>
          <td>{new Date(repo.updated_at).toString().slice(0, 15)}</td>
          <td><input type="checkbox" name={repo.id} onClick={event => checkHandler(event)} />&nbsp;</td>
        </tr>)
      })
    }
