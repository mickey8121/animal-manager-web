import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import app from 'helpers/app';

const initSentry = (): void => {
  if (app.nodeEnv !== 'development') {
    Sentry.init({
      dsn: app.sentryDnsKey,
      integrations: [new Integrations.BrowserTracing()],
      autoSessionTracking: true,
      environment: app.envName,
    });
  }
};

export default initSentry;
