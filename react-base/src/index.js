import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// Enabling the service worker causes 406 errors when using ryuu.js to make 
// API calls.
//registerServiceWorker();
