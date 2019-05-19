import React from 'react';
import ReactDOM from 'react-dom';
// Service worker
import * as serviceWorker from './common/serviceWorker';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router} from 'react-router-dom';
// App
import App from './App';

ReactDOM.render(
    <Router>
        <App/>
    </Router>,
    document.getElementById('root'));

registerServiceWorker();


serviceWorker.unregister();
