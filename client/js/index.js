import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// prevent landscape on mobile
screen.orientation.lock();

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('container')
);
