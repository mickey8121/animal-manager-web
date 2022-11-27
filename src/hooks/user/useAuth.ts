import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'helpers/constants';

import ME_QUERY from 'graphql/queries/users/me';

import {
  SignInInput,
  SignInMutation,
  SignUpInput,
  SignUpMutation,
  useSignInMutation,
  useSignUpMutation,
} from 'generated/graphql';

type SignIn = (data: SignInInput) => Promise<FetchResult<SignInMutation>>;
type SignUp = (data: SignUpInput) => Promise<FetchResult<SignUpMutation>>;

interface UseSignInResult {
  signIn: SignIn;
  signUp: SignUp;
  loading: boolean;
}

const useAuth = (): UseSignInResult => {
  const [signInMutation, { loading: signInLoading }] = useSignInMutation();
  const [signUpMutation, { loading: signUpLoading }] = useSignUpMutation();

  const signIn: SignIn = useCallback(
    data =>
      signInMutation({
        variables: { data },
        update: (cache, { data: response }) => {
          if (!response?.signIn) return;

          const { user, accessToken, refreshToken } = response?.signIn ?? {};

          if (accessToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

            cache.writeQuery({
              query: ME_QUERY,
              data: { me: user },
            });
          }

          if (accessToken && refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        },
      }),
    [signInMutation],
  );

  const signUp: SignUp = useCallback(
    data =>
      signUpMutation({
        variables: { data },
        update: (cache, { data: response }) => {
          if (!response?.signUp) return;

          const { user, accessToken, refreshToken } = response?.signUp ?? {};

          if (accessToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

            cache.writeQuery({
              query: ME_QUERY,
              data: { me: user },
            });
          }

          if (accessToken && refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        },
      }),
    [signUpMutation],
  );

  return { signIn, signUp, loading: signInLoading || signUpLoading };
};

export default useAuth;
