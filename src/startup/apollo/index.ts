import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  fromPromise,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';

import getNewToken from 'helpers/getNewToken';
import app from 'helpers/app';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'helpers/constants';

import cacheOptions from 'startup/apollo/cache-options';
import typePolicies from 'startup/apollo/type-policies';
import { toast } from 'react-hot-toast';

const cache = new InMemoryCache({ ...cacheOptions, typePolicies });

const httpLink = createHttpLink({ uri: app.apiUrl });

const wsLink = new WebSocketLink({
  uri: app.subscriptionUrl as string,
  options: {
    timeout: 30000,
    reconnect: true,
    lazy: true,
    connectionParams: (): any => ({
      Authorization: localStorage.getItem(ACCESS_TOKEN_KEY) ?? '',
      app: app.appName?.toUpperCase() ?? '',
    }),
  },
});

const errorLink = onError(({ graphQLErrors, operation, forward, response }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const { message } = err;

      const oldRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (message === 'Unauthorized') {
        if (oldRefreshToken) {
          return fromPromise(getNewToken()).flatMap((accessToken: string) => {
            const oldHeaders = operation.getContext().headers;

            operation.setContext({
              headers: {
                ...oldHeaders,
                Authorization: accessToken,
              },
            });

            return forward(operation);
          });
        }
        if (response) response.errors = undefined;
      } else {
        toast.error(message);
      }
    }
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const appName = app.appName?.toUpperCase();

  return {
    headers: {
      ...headers,
      app: appName,
      Authorization: token,
    },
  };
});

const splitLink = split(
  ({ query: { definitions } }): boolean =>
    definitions.some(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription',
    ),
  wsLink,
  httpLink,
);

const link = from([errorLink, authLink, splitLink]);

const client = new ApolloClient({ cache, link, name: app.envName, version: app.appVersion });

export default client;
