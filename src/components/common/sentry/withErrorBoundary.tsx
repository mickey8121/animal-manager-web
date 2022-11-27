import { ComponentType } from 'react';

import * as Sentry from '@sentry/react';

import Fallback from 'components/common/sentry/Fallback';

const withErrorBoundary = <P,>(Component: ComponentType<P>) => {
  return (props: P): JSX.Element => (
    <Sentry.ErrorBoundary fallback={Fallback}>
      <Component {...props} />
    </Sentry.ErrorBoundary>
  );
};

export default withErrorBoundary;
