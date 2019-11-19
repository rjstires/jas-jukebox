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

const App = () => {
  return (
    <>
      <LocationProvider history={history}>
        {() => (
          <Router>
            <Options default />
            <Home path="play" />
          </Router>
        )}
      </LocationProvider>
    </>
  );
};

export default App;
