import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Popup from 'react-popup';
import Maintenance from './Maintenance';


ReactDOM.render(
  <div className="maintenance">
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@200&display=swap');
    </style>

    <h1 className="maintenance_message">Sorry we are down for maintenance!</h1>
  </div>
    // <App />
  , document.getElementById('root')
);

ReactDOM.render(
    <Popup />
  , document.getElementById('popupContainer')
)
serviceWorker.unregister();
