function homeButtonClickHandler(){
  this.setState({
    on_home: false,
    display_form: true
  })
}

function generateApi(event){
  event.preventDefault()
  this.setState({
    token: document.forms["github-info-form"]["token"].value,
    user: document.forms["github-info-form"]["user"].value,
    display_form: false,
    display_api: true,
    on_home: false
  })
}


function resetState(){
  this.setState({
    on_home: true,
    display_form: false,
    display_api: false,
    token: null,
    user: null
  })
}


module.exports = {
          homeButtonClickHandler,
          generateApi,
          resetState}
