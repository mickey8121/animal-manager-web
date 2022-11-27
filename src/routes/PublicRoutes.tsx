import { useEffect } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import SignInPage from 'pages/public/SignInPage';
import SignUpPage from 'pages/public/SignUpPage';
import GoogleAuthPage from 'pages/public/GoogleAuthPage';
import ForgotPasswordPage from 'pages/public/ForgotPasswordPage';

import Loading from 'components/common/Loading';

import useGATracker from 'hooks/useGATracker';
import useScrollToTop from 'hooks/useScrollToTop';

const AuthRouter: React.FC = () => {
  const { pageView } = useGATracker();

  useScrollToTop();

  useEffect(() => {
    if (document.title !== 'Loading') pageView();
  }, [pageView]);

  return (
    <Switch>
      <Route exact path='/sign-in' component={SignInPage} />
      <Route exact path='/sign-up' component={SignUpPage} />
      <Route exact path='/forgot-password' component={ForgotPasswordPage} />
      <Route exact path='/reset-password' component={ForgotPasswordPage} />

      <Route exact path='/_oauth/apple' component={() => <Loading page />} />
      <Route exact path='/_oauth/google' component={GoogleAuthPage} />

      <Route render={() => <Redirect to='/sign-in' />} />
    </Switch>
  );
};

export default AuthRouter;
