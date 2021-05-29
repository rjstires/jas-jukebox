import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  createHistory,
  createMemorySource,
  LocationProvider,
  Router
} from "@reach/router";
import React from "react";
import Home from "../features/Home";
import Options from "../features/Options";

let source = createMemorySource("");

let history = createHistory(source);

const theme = createMuiTheme({
  palette: {
    primary: { main: '#BE2A2C' }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocationProvider history={history}>
        {() => (
          <Router>
            <Options default />
            <Home path="play" />
          </Router>

        )}
      </LocationProvider>
    </ThemeProvider>
  );
};

export default App;
