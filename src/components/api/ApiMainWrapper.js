import React, {Component} from 'react'
import { Button, Icon } from 'semantic-ui-react'
import deleteRepos from '../../functionalComponents/api/deleteRepos'
import MaterialUITable from '../../functionalComponents/table/materialUITable.js';
import { getOctokit } from '../../helpers/api/git';

const stage = {
  INITIAL: 0,
  FETCHED: 1,
  TO_DELETE: 2,
  UNKNOWN: 3,
}

export default class ApiMainWrapper extends Component{
  state = {
    rows: [],
    phase: stage.INITIAL,
    selected: [],
    rowsToDelete: []
  }

  buttonRender = this.buttonRender.bind(this)
  updateSelected = this.updateSelected.bind(this)

  componentDidMount(){
    this.setState({
      rows: this.props.apiRepos,
      phase: stage.FETCHED,
      originalRows: this.props.apiRepos
    })
  }

  buttonRender(phase, user, token, rowsToDelete, resetState) {
    const octokit = getOctokit(token);
    if (phase === stage.FETCHED) {
      return(
        <div>
          
          <Button animated className="blue button" onClick={() => {
            this.updatePhase(1)
          }
          }>
            <Button.Content visible>Continue</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button>
        </div>
        )
      }
    else if(phase === stage.TO_DELETE){
      return(
        <div>
          <Button animated className="blue button" onClick={()=> this.updatePhase(-1, 'back')}>
            <Button.Content visible>Go back</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow left' />
            </Button.Content>
          </Button>
          <Button animated className="red button delete-button" onClick={()=> deleteRepos(octokit, rowsToDelete, resetState)}>
            <Button.Content visible>Confirm</Button.Content>
            <Button.Content hidden>
              <Icon name='trash alternate' />
            </Button.Content>
          </Button>
          </div>
        )

    }
    else if (phase === stage.UNKNOWN){
      return
    }

  }

  updatePhase(move, exception) {
    const updatedPhase = this.state.phase + move
    
    if( updatedPhase === stage.FETCHED &! exception){
      this.setState({phase: updatedPhase })
    }
    else if (updatedPhase === stage.FETCHED && exception){
      this.setState({phase: updatedPhase, rows: this.state.originalRows })
    }

    if (updatedPhase === stage.TO_DELETE){
      const rowsToDelete = [];
      this.state.rows.forEach( row => {
        if(this.state.selected.includes(row.name)){
          rowsToDelete.push(row)
        }
      })

      this.setState({
        rows: rowsToDelete,
        phase: updatedPhase
      })
    }
  }

  instructionsHandler(phase){
    console.log(`instructions handler phase: ${phase}`)
      switch(phase){
        case 1 :
          return 'Select Repos to Delete then hit Continue'
        case 2 :
          return 'Are you sure you want to delete the following repos?'
        default:
          break
      }
  }

  updateSelected(selectedRows) {
    const rowsToDelete =  this.state.rows.filter( row => {
       return selectedRows.includes(row.name)
    })
    
    this.setState({selected: selectedRows, rowsToDelete}, () => console.log(`the mfs getting deleted are.. ${this.state.rowsToDelete}`))
  }


  render(){
    const { user, token, resetState } = this.props
    const { rows, phase, selected, rowsToDelete } = this.state
    const { buttonRender, instructionsHandler, updateSelected} = this
    return(
        <div class="animated fadeInRight">
          <div className="selectionDiv">
            <h1>{instructionsHandler(phase)}</h1>
            <div className="buttons">
                { buttonRender(phase, user, token, rowsToDelete, resetState )}
            </div>
          </div>
            <br/>
          <div id="table-div">
            <div id="new-table">
              <MaterialUITable
                rows={rows}
                selected={selected}
                updateSelected={updateSelected}
                phase={phase}
                />
            </div>
          </div>
        </div>
    )
  }

}
