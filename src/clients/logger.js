import { Severity } from '@sentry/types';

class Logger {
  initSentryLogger(config = { dsn: null, release: 'unknown' }, sentry = undefined) {
    let externalClientErr = null;

    if (sentry) {
      // If there is already a copy of Sentry loaded on the page, then it causes
      // issues to instantiate a new copy. Instead, use the one passed in as
      // an option.

      try {
        const client = new sentry.BrowserClient({
          integrations: sentry.defaultIntegrations,
          ...config,
        });
        this.sentry = new sentry.Hub(client);
        return;
      } catch (err) {
        // Catch any errors and fallback to using a local copy of the client if
        // necessary.
        externalClientErr = err;
      }
    }

    const Sentry = require('@sentry/browser');
    Sentry.init(config);
    this.sentry = Sentry.getCurrentHub();

    if (externalClientErr) {
      // There was some kind of error thrown initializing the external client.
      // This should be fixed, but in the mean time log the error so we are
      // notified.
      this.sentry.captureException(externalClientErr);
    }
  }

  setContext(context = {}) {
    if (!this.sentry) {
      throw new Error('Sentry client not initialized!');
    }
    this.sentry.configureScope((scope) => {
      for (let tag in context) {
        scope.setTag(tag, context[tag]);
      }
    });
  }

  _doWithContext(action, context = { tags: {}, extra: {} }) {
    this.sentry.withScope((scope) => {
      for (let tag in context.tags) {
        scope.setTag(tag, context.tags[tag]);
      }
      for (let extraKey in context.extra) {
        scope.setExtra(extraKey, context.extra[extraKey]);
      }
      action();
    });
  }

  capture(level, message, options = { tags: {}, extra: {} }) {
    if (!this.sentry) {
      throw new Error('Sentry client not initialized!');
    }
    if (SENTRY_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Sentry message: ', message);
      return;
    }
    this._doWithContext(this.sentry.captureMessage.bind(this.sentry, message, level), options);
  }

  exception(e, options = { tags: {}, extra: {} }) {
    if (!this.sentry) {
      throw new Error('Sentry client not initialized!');
    }
    if (SENTRY_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Sentry error: ', e);
      return;
    }
    this._doWithContext(this.sentry.captureException.bind(this.sentry, e), options);
  }

  info = (message, options) => this.capture(Severity.Info, message, options);
  warning = (message, options) => this.capture(Severity.Warning, message, options);
  error = (message, options) => this.capture(Severity.Error, message, options);
}

export default new Logger();
