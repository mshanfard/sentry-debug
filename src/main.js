import React, { Component } from "react";
import logger from '../src/clients/logger'

class App extends Component {
  render() {
    logger.exception('logging to demo slow tests due to sentry');
    return (
      <div>
        <main className="container">
            <p>This is a DEMO</p>
        </main>
      </div>
    );
  }
}

export default App;
