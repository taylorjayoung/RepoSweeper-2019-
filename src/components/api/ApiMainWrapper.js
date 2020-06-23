import React, {Component, Fragment} from 'react'
import $ from 'jquery';
import { Button, Icon } from 'semantic-ui-react'
import Popup from 'react-popup';
import repoMapper from '../../helpers/api/repoMapper'
import fetchRepos from '../../functionalComponents/api/fetchRepos'
import deleteRepos from '../../functionalComponents/api/deleteRepos'
import MaterialUITable from '../../functionalComponents/table/materialUITable.js'

const axios = require('axios');
const fs = require('browserify-fs');
const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: 20,
  shiftY: 10
}

export default class ApiMainWrapper extends Component{
  state = {
    rows: [],
    originalRows: [],
    phase: 0,
    selected: []
  }


  buttonRender = this.buttonRender.bind(this)
  updateSelected = this.updateSelected.bind(this)

  async componentDidMount(){
    fetchRepos(this.props.user, this.props.token)
    .then( result => {
      const rows = repoMapper(result)
      this.setState({rows, reposLoaded: true, phase: 1, originalRows: rows})
    })
  }


buttonRender(phase, user, token, repos, resetState){
if ( phase === 1){
      return(
        <div>
          <Button animated className="blue button" onClick={()=> this.updatePhase(1)}>
            <Button.Content visible>Continue</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button>
        </div>
        )
      }
    else if(phase === 2){
     return(
       <div>
        <Button animated className="blue button" onClick={()=> this.updatePhase(-1, 'back')}>
          <Button.Content visible>Go back</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow left' />
          </Button.Content>
        </Button>
        <Button animated className="red button delete-button" onClick={()=> deleteRepos(user, token, this.getRowsToDelete(), resetState)}>
          <Button.Content visible>Confirm</Button.Content>
          <Button.Content hidden>
            <Icon name='trash alternate' />
          </Button.Content>
        </Button>
        </div>
      )

    }
    else if (phase === 3){
      return
    }

  }

updatePhase(move, exception){
    const updatedPhase = this.state.phase + move

    if( updatedPhase === 1 &! exception){
      this.setState({phase: updatedPhase })
    }
    else if (updatedPhase === 1 && exception){
      this.setState({phase: updatedPhase, rows: this.state.originalRows })
    }
    if( updatedPhase === 2){
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

  getRowsToDelete(){
    const rowsToDelete = [];
    console.log(`getting rows to delete:
      selected: ${JSON.stringify(this.state.selected)},
      rows: ${JSON.stringify(this.state.rows)}`)
    const finalRows =  this.state.rows.filter( row => {
       return this.state.selected.includes(row.name)
     })
     console.log(JSON.stringify(finalRows))
     return finalRows
  }

  updateSelected(selectedRows){
    console.log(`update selected: ${selectedRows}`)
    this.setState({selected: selectedRows})
  }


  render(){
    const { user, token, resetState } = this.props
    const { rows, reposLoaded, phase, selected } = this.state
    const { buttonRender, instructionsHandler, updateSelected} = this
    return(
        <div class="animated fadeInRight">
          <div className="selectionDiv">
            <h1>{instructionsHandler(phase)}</h1>
            <div className="buttons">
                { buttonRender(phase, user, token, rows, resetState )}
            </div>
          </div>
            <br/>
          <div id="table-div">
            <div id="new-table">
              {reposLoaded ? <MaterialUITable
                rows={rows}
                selected={selected}
                updateSelected={updateSelected}
                /> : null}
            </div>
          </div>
        </div>
    )
  }

}
