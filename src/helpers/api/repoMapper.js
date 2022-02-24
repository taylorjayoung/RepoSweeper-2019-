export default function repoMapper(repos){
  return repos.map(repo => {
    return {
      owner: repo.owner && repo.owner.login ? repo.owner.login : null,
      id: repo.id ? repo.id : null,
      name: repo.name ? repo.name : null,
      description: !repo.description || repo.description < 1 ? null : repo.description,
      fork: repo.fork.toString() ? repo.fork.toString() : null,
      createdDate: new Date(repo.created_at).toString().slice(0, 15),
      updatedDate: new Date(repo.updated_at).toString().slice(0, 15),
      full_name: repo.full_name
    }
  })
}
