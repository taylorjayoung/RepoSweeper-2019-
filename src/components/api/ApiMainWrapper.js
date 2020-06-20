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
    phase: 0,
    selected: []
  }


  buttonRender = this.buttonRender.bind(this)
  updateSelected = this.updateSelected.bind(this)

  async componentDidMount(){
    fetchRepos(this.props.user, this.props.token)
    .then( result => {
      const rows = repoMapper(result)
      this.setState({rows, reposLoaded: true, phase: 1})
    })
  }


buttonRender(phase, user, token){
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
        <Button animated className="blue button" onClick={()=> this.updatePhase(-1)}>
          <Button.Content visible>Go back</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow left' />
          </Button.Content>
        </Button>
        <Button animated className="red button delete-button" onClick={()=> deleteRepos(user, token)}>
          <Button.Content visible>Confirm</Button.Content>
          <Button.Content hidden>
            <Icon name='trash alternate' />
          </Button.Content>
        </Button>
        </div>
      )
    }
    else if (phase === 3){

    }

  }

  updatePhase(move){
    this.setState({phase: this.state.phase + move}, () => console.log(`phase state: ${this.state.phase}`))
  }

  instructionsHandler(phase){
      switch(phase){
        case 1 :
          return 'Select Repos to Delete then hit Continue'
        case 2 :
          return 'Make sure these are the repos you want to delete.. then hit Confirm'
        default:
          break
      }
  }

  updateSelected(selectedRows){
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
                { buttonRender(phase, user, token )}
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
