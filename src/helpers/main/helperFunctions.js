import Popup from 'react-popup';

export function homeButtonClickHandler(){
  this.setState({
    on_home: false,
    display_form: true
  })
}

export function resetState(){
  this.setState({
    on_home: true,
    display_form: false,
    display_api: false,
    form_submitted: false,
    token: null,
    username: null,
    display_table: false,
    apiRepos: []
  })
}

export  function apiFormHandler(event){
  event.preventDefault()

  if(event.target.name === 'user'){
    this.setState({username: event.target.value})
  }
  else if(event.target.name === 'token'){
    this.setState({token: event.target.value})
  }
  else if(event.target.parentElement.name === 'submit'){
    let noUser = false
    let noToken = false

    if(!this.state.username || this.state.username.trim().length === 0){
      noUser = true
    }

    else if(!this.state.token || this.state.token.trim().length === 0){
      noToken = true
    }

    if(noToken || noUser){
      let errorMessage = ''
      if(noToken) errorMessage += 'You need to have a valid token generated from GitHub.'
      if(noUser) errorMessage += ' Please make sure you entered your full GitHub username.'
      createPopup(errorMessage)
    }

    else {
      this.setState({
        display_form: false,
        on_home: false,
        form_submitted: true,
      }, () => console.log(`setting state after form: ${JSON.stringify(this.state)}`))
    }
  }
}

function createPopup(message){
  console.log(`popup: ${message}`)
  Popup.create({
      title: "Incomplete Form",
      content: message,
      buttons: {
          right: [{
              text: 'Ok',
              action: function () {
                   Popup.close()
              }
          }]
      }
  });
}
