import React from 'react';
import Header from './Header';
import Weather from './Weather';
import Forecast from './Forecast';

import '../../sass/style.scss';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      weather: true
    };

    this.updatePage = this.updatePage.bind(this);
  }

  componentDidMount() {
    document.body.className = 'hyrule-night';
  }

  static updateTheme(bool) {
    if (bool) {
      document.body.className = 'hyrule-night';
    } else {
      document.body.className = 'hyrule-day';
    }
  }

  updatePage(bool) {
    this.setState({ weather: bool });
  }

  render() {
    return (
      <div className="main-container">
        <Header updateTheme={App.updateTheme} updatePage={this.updatePage} />
        <main className={this.state.weather ? 'today-weather' : ''}>
          {this.state.weather ? <Weather /> : <Forecast />}
        </main>
      </div>
    );
  }
}
