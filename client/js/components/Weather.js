import React, { Component } from 'react';

export default class Weather extends Component {
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
      `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()},us&units=imperial&APPID=${process.env.WEATHER_API_KEY}`
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
