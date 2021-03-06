// For using in jsFiddle, comment out these next 3 lines
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../sass/style.scss';

if (!window.process) {
  window.process = {};
  process.env = {};
  process.env.WEATHER_API_KEY = '2b07eb79e75f25c3f2d9b46b33061a82';
}
function Header(props) {
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

class Weather extends React.Component {
  static formatNumbers(number) {
    return Math.round(number);
  }

  static getFormattedTime(time) {
    return new Date(Number(`${time}000`))
      .toLocaleTimeString('en-US')
      .replace(/:\d\d([ ap]|$)/, '$1');
  }

  state = {
    data: {},
    city: 'Phoenix'
  };

  componentDidMount() {
    this.getWeatherData('Phoenix');
  }

  getWeatherData(city) {
    // I could've used the city ID but I wanted to have room for the user to
    // Use different cities.  For now it just supports Phoenix.
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()},us&units=imperial&APPID=${process.env.WEATHER_API_KEY}`
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          data: json,
          city
        });
      });
  }

  checkData() {
    const { data } = this.state;

    if (Object.keys(data).length <= 0) return;
    return data;
  }

  render() {
    const data = this.checkData();

    if (!data) return null;

    const {
      weather,
      main,
      sys: { sunrise, sunset },
      name
    } = data;
    const { temp, temp_max: max, temp_min: min } = main;
    const { main: weatherMain, icon } = weather[0];

    return (
      <div className="weather-main-container">
        <div>
          <h2 style={{ marginBottom: 0 }}>Hyrule</h2>
          <span style={{ marginBottom: 0, marginTop: 0, fontSize: '10pt' }}>
            (AKA: {name})
          </span>
          <h6 style={{ marginTop: 0, color: '#f7f7f7aa' }}>
            as of {Weather.getFormattedTime(data.dt)}
          </h6>
          <h1 style={{ marginBottom: 0 }}>
            {Weather.formatNumbers(temp)}
            <sup>°</sup>
          </h1>
          <h5 style={{ marginTop: 0 }}>{weatherMain}</h5>
          <img
            style={{
              width: '75px',
              height: '75px'
            }}
            src={`http://openweathermap.org/img/w/${icon}.png`}
            alt={`${weatherMain} weather icon`}
          />
          <h3>
            H {Weather.formatNumbers(max)}
            <sup>°</sup> / L {Weather.formatNumbers(min)}
            <sup>°</sup>
          </h3>
          <h5>Sunrise: {Weather.getFormattedTime(sunrise)}</h5>
          <h5>Sunset: {Weather.getFormattedTime(sunset)}</h5>
        </div>
      </div>
    );
  }
}

class Forecast extends React.Component {
  static formatNumbers(number) {
    return Math.round(number);
  }

  state = {
    city: '',
    day: 'Sunday',
    organizedData: {},
    showDay: false
  };

  dayOfTheWeek = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  };

  hourConversion = {
    '00': '12AM',
    '03': '3AM',
    '06': '6AM',
    '09': '9AM',
    '12': '12PM',
    '15': '3PM',
    '18': '6PM',
    '21': '9PM'
  };

  componentDidMount() {
    this.getForecastData('Phoenix');
  }

  getForecastData(city) {
    // I could've used the city ID but I wanted to have room for the user to
    // Use different cities.  For now it just supports Phoenix.
    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${city.toLowerCase()},us&units=imperial&APPID=${
        process.env.WEATHER_API_KEY
        }`
    )
      .then(response => response.json())
      .then(json => {
        window.showMe = json;
        const formattedDate = json.list[0].dt_txt.replace(
          /\ \d{2}:\d{2}:\d{2}/,
          ''
        );
        this.setState({
          day: this.dayOfTheWeek[new Date(formattedDate).getDay()],
          organizedData: this.createDaysOfData(json.list),
          city
        });
      });
  }

  handleClick = day => () => {
    this.setState({
      day,
      showDay: true
    });
  };

  handleBackClick = () => {
    this.setState({
      showDay: false
    });
  };

  handlePreviousClick = day => () => {
    this.setState({
      day
    });
  };

  handleNextClick = day => () => {
    this.setState({
      day
    });
  };

  createDaysOfData(list) {
    let date = this.dayOfTheWeek[
      new Date(list[0].dt_txt.replace(/ \d{2}:\d{2}:\d{2}/, '')).getDay()
      ];
    const obj = {
      [date]: []
    };
    list.forEach(item => {
      const currentDay = this.dayOfTheWeek[
        new Date(item.dt_txt.replace(/ \d{2}:\d{2}:\d{2}/, '')).getDay()
        ];
      if (currentDay === date) {
        obj[currentDay].push(item);
      } else {
        obj[currentDay] = [item];
        date = currentDay;
      }
    });

    return obj;
  }

  renderDays(lists) {
    return Object.keys(lists).map((list, idx) => {
      let high = -2000;
      let low = 2000;
      let skies = '';
      let icon = '';

      lists[list].forEach(item => {
        if (item.main.temp > high) {
          high = item.main.temp;
        }
        if (item.main.temp < low) {
          low = item.main.temp;
        }

        if (item.weather[0].main !== skies) {
          skies = item.weather[0].main;
          icon = item.weather[0].icon.replace(/n/, 'd');
        }
      });
      return (
        <button
          key={`content-${idx}`}
          onClick={this.handleClick(list)}
          type="button"
          className="day-button-card"
        >
          <h3>{list}</h3>
          <p>
            {Forecast.formatNumbers(high)}
            <sup>°</sup> / {Forecast.formatNumbers(low)}
            <sup>°</sup>{' '}
          </p>
          <p>{skies}</p>
          <img
            src={`http://openweathermap.org/img/w/${icon}.png`}
            alt={`${skies} weather icon`}
          />
        </button>
      );
    });
  }

  renderForecastPerDay(list) {
    const items = list[this.state.day];

    return items.map((data, idx) => {
      const {
        weather,
        main: { temp },
        dt_txt
      } = data;
      const { main: weatherMain, icon } = weather[0];

      const time = this.hourConversion[
        dt_txt.replace(/\d{4}-(\d{2})-\d{2} /, '').replace(/:00:00/, '')
        ];
      return (
        <div key={`content-${idx}`} className="individual-day-display">
          <h3>{time}</h3>
          <img
            src={`http://openweathermap.org/img/w/${icon}.png`}
            alt={`${weatherMain} weather icon`}
          />
          <p>
            {Forecast.formatNumbers(temp)}
            <sup>°</sup>
          </p>
        </div>
      );
    });
  }

  renderOtherDays(list) {
    const days = Object.keys(list);
    const index = days.indexOf(this.state.day);

    return {
      previousDay: index - 1 >= 0 && days[index - 1],
      nextDay: index + 1 <= days.length - 1 && days[index + 1]
    };
  }

  renderMobileDays(lists) {
    return Object.keys(lists).map((list, idx) => {
      let high = -2000;
      let low = 2000;
      let skies = '';
      let icon = '';

      lists[list].forEach(item => {
        if (item.main.temp > high) {
          high = item.main.temp;
        }
        if (item.main.temp < low) {
          low = item.main.temp;
        }

        if (item.weather[0].main !== skies) {
          skies = item.weather[0].main;
          icon = item.weather[0].icon.replace(/n/, 'd');
        }
      });
      return (
        <button
          className={`day-mobile-card${
            list === this.state.day ? '-selected' : ''
            }`}
          key={`content-${idx}`}
          onClick={this.handleClick(list)}
          type="button"
        >
          <div className="day-button-card">{list}</div>
          <div className="day-content-wrapper-mobile">
            <img
              src={`http://openweathermap.org/img/w/${icon}.png`}
              alt={`${skies} weather icon`}
            />
            <p>{Forecast.formatNumbers(high)}</p>
            <p className="weather-low-text">{Forecast.formatNumbers(low)}</p>
          </div>
        </button>
      );
    });
  }

  renderDesktopDays(previousDay, nextDay) {
    return (
      <React.Fragment>
        <button
          style={{ visibility: previousDay ? 'visible' : 'collapse' }}
          className="back-button-previous"
          type="button"
          onClick={this.handlePreviousClick(previousDay)}
        >
          {previousDay || 'Nothing'}
        </button>
        <button
          className="back-button"
          type="button"
          onClick={this.handleBackClick}
        >
          Back
        </button>
        <button
          style={{ visibility: nextDay ? 'visible' : 'collapse' }}
          className="back-button-next"
          type="button"
          onClick={this.handleNextClick(nextDay)}
        >
          {nextDay || 'Nothing'}
        </button>
      </React.Fragment>
    );
  }

  renderMobileOrDesktop() {
    const { organizedData, day, showDay } = this.state;
    const { previousDay, nextDay } = this.renderOtherDays(organizedData);
    const isMobile = window.innerWidth <= '500';

    if (isMobile) {
      return (
        <div className="forecast-wrapper" style={{ flexDirection: 'column' }}>
          <h2 className="forecast-day-header">{day}</h2>
          <div className="hourly-forecast-container">
            {this.renderForecastPerDay(organizedData)}
          </div>
          <div className="single-day-buttons-container-mobile">
            {this.renderMobileDays(organizedData)}
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        {!showDay && (
          <div className="forecast-wrapper">
            {this.renderDays(organizedData)}
          </div>
        )}
        {showDay && (
          <div className="forecast-wrapper" style={{ flexDirection: 'column' }}>
            <h2 className="forecast-day-header">{day}</h2>
            <div className="hourly-forecast-container">
              {this.renderForecastPerDay(organizedData)}
            </div>
            <div className="single-day-buttons-container-desktop">
              {this.renderDesktopDays(previousDay, nextDay)}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { organizedData, day } = this.state;

    if (!organizedData[day]) return null;

    return (
      <div style={{ padding: '20px 0', width: '100%', fontSize: '18pt' }}>
        <h1 style={{ textAlign: 'center' }}>Hyrule</h1>
        <h6 style={{ textAlign: 'center' }}>(AKA: {this.state.city})</h6>
        {this.renderMobileOrDesktop()}
      </div>
    );
  }
}


class App extends React.Component {
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

ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('container')
);
