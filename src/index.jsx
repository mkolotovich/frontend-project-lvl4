import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import Init from './init.jsx';

const mountNode = document.getElementById('chat');
ReactDOM.render(<Provider store={store}><Init /></Provider>, mountNode);
