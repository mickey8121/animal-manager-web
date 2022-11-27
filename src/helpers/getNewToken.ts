import { print } from 'graphql';

import app from 'helpers/app';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'helpers/constants';

import REFRESH_TOKEN_MUTATION from 'graphql/mutations/auth/refreshToken';

const getNewToken = (): Promise<string> => {
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);

  return fetch(app.apiUrl!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: print(REFRESH_TOKEN_MUTATION),
      variables: { token },
    }),
  })
    .then(res => res.json())
    .then(({ data }) => {
      const { accessToken, refreshToken } = data?.refreshToken || {};

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      return accessToken;
    });
};

export default getNewToken;
