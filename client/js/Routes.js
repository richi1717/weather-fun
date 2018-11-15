import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './components/App';
import Weather from './components/Weather';
import Forecast from './components/Forecast';

export default function Routes(props) {
  const { store } = props;

  return (
    <BrowserRouter>
      <App state={store} location={location}>
        <Switch>
          <Route
            exact
            path="/"
            render={routeProps => <Weather history={routeProps.history} />}
          />
          <Route
            exact
            path="/weather"
            render={(routeProps, rest) => <Weather history={routeProps.history} {...rest} />}
          />
          <Route
            exact
            path="/5dayforecast"
            render={routeProps => <Forecast history={routeProps.history} />}
          />
        </Switch>
      </App>
    </BrowserRouter>
  );
}

Routes.propTypes = {
  store: PropTypes.object.isRequired
};
