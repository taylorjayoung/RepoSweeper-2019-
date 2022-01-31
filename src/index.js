import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Popup from 'react-popup';

ReactDOM.render(
  <>
    {/* <App /> */}
  <div className="maintenance">
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@200&display=swap');
    </style>

    <h1 className="maintenance_message">Sorry we are down for maintenance!</h1>
  </div>

  < />
  , document.getElementById('root'));

ReactDOM.render(
  <>
    <Popup />
  < />
  , document.getElementById('popupContainer'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
