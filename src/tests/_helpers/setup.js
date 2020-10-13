// Jest doesn't run within webpack, let's define a few missing constants

window.VERSION = 'test';
window.SENTRY_ENV = 'test';

// Configure Enzyme for use with React
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Mock Sentry
import sentryTestKit from 'sentry-testkit';
import logger from '../../clients/logger';

const { sentryTransport } = sentryTestKit();

logger.initSentryLogger({
  dsn: 'https://acacaeaccacacacabcaacdacdacadaca@sentry.io/000001',
  release: 'dummy-version',
  transport: sentryTransport,
});

if (!process.listeners('unhandledRejection').length) {
  // only attach the `unhandledRejection` listener once
  // or else you get a memory leak in watch mode
  process.on('unhandledRejection', function (reason, p) {
    global.console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
  });
}
