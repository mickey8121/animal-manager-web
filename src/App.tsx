import { FC } from 'react';

import { ApolloProvider } from '@apollo/client';

import Router from 'routes/Router';

import UserProvider from 'providers/UserProvider';
import ConfirmProvider from 'providers/ConfirmProvider';

import withErrorBoundary from 'components/common/sentry/withErrorBoundary';
import ToasterNotifications from 'components/common/ToasterNotifications';

import client from 'startup/apollo';

const App: FC = () => (
  <ApolloProvider client={client}>
    <UserProvider>
      <ConfirmProvider>
        <Router />
      </ConfirmProvider>
    </UserProvider>
    <ToasterNotifications />
  </ApolloProvider>
);

export default withErrorBoundary(App);
