import React from 'react';
import PropTypes from 'prop-types';

export default function Header(props) {
  const style = {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '64px',
    alignItems: 'center'
  };

  return (
    <header className="header-container">
      <div style={style}>
        <div>
          <button
            type="button"
            className="header-buttons"
            onClick={() => props.updateTheme(true)}
          >
            Dark
          </button>
          <button
            type="button"
            className="header-buttons"
            onClick={() => props.updateTheme(false)}
          >
            Light
          </button>
        </div>
        <div className="header-button-wrapper">
          <button
            type="button"
            className="header-buttons"
            onClick={() => props.updatePage(true)}
          >
            Today
          </button>
          <button
            type="button"
            className="header-buttons"
            onClick={() => props.updatePage(false)}
          >
            5 Day
          </button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  updateTheme: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired
};
