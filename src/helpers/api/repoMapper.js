import React from 'react'

export default function repoMapper(repos, searchterm, checkHandler){

      const rows = []
      repos.forEach(repo => {
        let description = repo.description ? repo.description : null

        if(!description || description.length < 1) description = 'No description'

        const currentRow = {
          id: repo.id ? repo.id : null,
          name: repo.name ? repo.name : null,
          description: description,
          fork: repo.fork.toString() ? repo.fork.toString() : null,
          createdDate: new Date(repo.created_at).toString().slice(0, 15),
          updatedDate: new Date(repo.updated_at).toString().slice(0, 15),
          full_name: repo.full_name
        }
        rows.push(currentRow)
      })

      return rows
    }
