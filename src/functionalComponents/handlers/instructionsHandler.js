import Popup from 'react-popup';

export default function instructionsHandler(){
  Popup.alert('Clicking the "Generate Access Token" link below will bring you to GitHubs token generator page. Once there, click "Generate new token" on the top right of the screen.');
  Popup.alert('Select "public_repo" and "delete_repo" from the listed options. Then, click "Generate token" and paste the generated token in the input field below.');
  Popup.alert('Submit. You will have the opportunity to choose which repos you want to save and delete after you hit "Generate Repo List"');
}
