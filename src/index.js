import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Popup from 'react-popup';


ReactDOM.render(
    <App />
  , document.getElementById('root')
);

ReactDOM.render(
    <Popup />
  , document.getElementById('popupContainer')
)
serviceWorker.unregister();
