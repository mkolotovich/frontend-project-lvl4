import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import store from './slices/index.js';

const mountNode = document.getElementById('chat');

ReactDOM.render(<Provider store={store}>
  <App />
</Provider>, mountNode);
